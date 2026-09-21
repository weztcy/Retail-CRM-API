import type { Metadata } from "next";


export const metadata: Metadata = {

  title: "Retail CRM",

  description: "Retail CRM Backend",

};



export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {


  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>

  );


}