import { Theme } from "@radix-ui/themes";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function Root() {
	const [appearance, setAppearance] = useState<"light" | "dark">("light");

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setAppearance(mediaQuery.matches ? "dark" : "light");

		const handler = (e: MediaQueryListEvent) => {
			setAppearance(e.matches ? "dark" : "light");
		};
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return (
		<Theme
			appearance={appearance}
			accentColor="gray"
			radius="medium"
			scaling="95%"
		>
			<App />
		</Theme>
	);
}

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<Root />
	</StrictMode>,
);
