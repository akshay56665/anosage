import UserNavbar from "./UserNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserNavbar />
        {children}
      </body>
    </html>
  );
}
