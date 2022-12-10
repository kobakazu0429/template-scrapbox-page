export const getServerURL = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://template-scrapbox-page.vercel.app/";
  }

  return "http://localhost:3000/";
};
