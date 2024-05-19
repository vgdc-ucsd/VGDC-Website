import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PostsProvider from "../components/PostsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "VGDC @ UCSD",
	description: "Video Game Development Club at UC San Diego",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<PostsProvider>
					{children}
				</PostsProvider>
			</body>
		</html>
	);
}
