import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { Input, Button, Sidebar, Heading, FormGroup, Stack } from "smarthr-ui";
import styled from "styled-components";
import { useForm, FormProvider } from "react-hook-form";
import Mustache from "mustache";
import { VariableInput } from "../components/VariableInput";
import { VariableToggle } from "../components/VariableToggle";
import { useCallback, useMemo, useState } from "react";
import { getServerURL } from "../utils/server";

interface Props {
  url: string;
  title: string;
  contents: string;
  projectName: string;
}

const extractVariables = (text: string[]) => {
  return Array.from(
    new Set(
      text
        .map((v) => Mustache.parse(v, Mustache.tags))
        .flat(1)
        .filter(([type]) => ["name", "#"].includes(type))
        .map(([, name]) => name)
    )
  );
};

const Home: NextPage<Props> = (props) => {
  const [url, setUrl] = useState(props.url);
  const [title, setTitle] = useState(props.title);
  const [contents, setContents] = useState(props.contents);
  const [projectName, setProjectName] = useState(props.projectName);
  const methods = useForm();

  const variables = useMemo(
    () => extractVariables([title, contents]),
    [title, contents]
  );

  const updateUrl = useCallback(async () => {
    const { title, contents, projectName } = await getScrapboxData(url);
    setTitle(title);
    setContents(contents);
    setProjectName(projectName);
  }, [url]);

  const handleCreate = useCallback(() => {
    const values = methods.getValues();
    for (const key in values) {
      if (!key.startsWith("is_")) continue;
      if (typeof values[key] === "boolean") continue;
      values[key] = false;
    }
    let isOk = true;
    if (Object.values(values).some((v) => v === "")) {
      isOk = confirm(
        "入力されていないフィールドがありますが、よろしいですか？"
      );
    }

    if (!isOk) return;

    const newTitle = Mustache.render(title, values);
    const newBody = Mustache.render(contents, values);
    const newUrl = `https://scrapbox.io/${projectName}/${newTitle}?body=${encodeURIComponent(
      newBody
    )}`;
    console.log(newUrl);
    window.open(newUrl, "_blank");
  }, [methods, title, contents, projectName]);

  return (
    <>
      <Head>
        <title>Scrapbox ページ テンプレート</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FormProvider {...methods}>
        <Sidebar
          right
          contentsMinWidth="600px"
          gap={{ row: 2, column: 2 }}
          style={{ padding: 20 }}
        >
          <Main>
            <Stack gap={3}>
              <Heading>Scrapbox ページ テンプレート</Heading>
              <FormGroup
                title="テンプレートURL"
                titleType="subBlockTitle"
                innerMargin="XXS"
                htmlFor="template"
              >
                <Flex>
                  <WideInput
                    id="template"
                    width="100%"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={updateUrl}>更新する</Button>
                </Flex>
              </FormGroup>

              <FormGroup
                title="ページタイトル"
                titleType="subBlockTitle"
                innerMargin="XXS"
                htmlFor="title"
              >
                <Input id="title" width="100%" value={title} readOnly />
              </FormGroup>

              <Stack gap={1}>
                {variables.map((v) => {
                  if (v.startsWith("is_")) {
                    return <VariableToggle key={v} variable={v} />;
                  }
                  return <VariableInput key={v} variable={v} />;
                })}
              </Stack>

              <Button onClick={handleCreate}>作成</Button>
            </Stack>
          </Main>

          <Side>
            <label htmlFor="contents">コンテンツ</label>
            <pre id="contents">{contents}</pre>
          </Side>
        </Sidebar>
      </FormProvider>
    </>
  );
};

export default Home;

const getScrapboxData = async (url: string) => {
  const [projectName, pageTitle] = url.split("/").slice(-2);
  const res = await fetch(
    `${getServerURL()}/api/scrapbox?projectName=${projectName}&pageTitle=${pageTitle}`
  );
  const { title, contents } = await res.json();
  return { title, contents, projectName };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { template } = context.query;
  if (typeof template === "string") {
    try {
      const { title, contents, projectName } = await getScrapboxData(template);
      const props: Props = {
        url: template,
        title,
        contents,
        projectName,
      };

      return {
        props,
      };
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  }

  return {
    props: {},
  };
};

const Main = styled.main``;

const Side = styled.aside`
  width: 900px;
`;

const Flex = styled.div`
  display: flex;
  gap: 16px;
`;

const WideInput = styled(Input)`
  flex-grow: 1;
`;
