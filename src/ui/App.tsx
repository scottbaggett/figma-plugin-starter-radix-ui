import {
	Box,
	Flex,
	Heading,
	Separator,
	Table,
	Tabs,
	Text,
	Theme,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type { CSSPaintStyle } from "@/shared/types";

function App() {
	const [styles, setStyles] = useState<CSSPaintStyle[]>([]);
	const [textStyles, setTextStyles] = useState<TextStyle[]>([]);

	useEffect(() => {
		parent.postMessage({ pluginMessage: { type: "get-paint-styles" } }, "*");
		parent.postMessage({ pluginMessage: { type: "get-text-styles" } }, "*");
	}, []);

	useEffect(() => {
		window.onmessage = (event: MessageEvent) => {
			const msg = event.data.pluginMessage;
			if (!msg) return;

			switch (msg.type) {
				case "paint-styles-response":
					setStyles(msg.styles);
					break;
				case "text-styles-response":
					setTextStyles(msg.styles);
					break;
			}
		};
	}, []);

	return (
		<Theme accentColor="iris">
			<Box p="4">
				<Flex direction="column" gap="2">
					<Heading size="5" as="h1">
						Figma Plugin
					</Heading>
					<Text size="2">
						This plugin uses Radix UI primitives and themes for styling.
					</Text>

					<Tabs.Root defaultValue="paint">
						<Tabs.List>
							<Tabs.Trigger value="paint">Paint Styles</Tabs.Trigger>
							<Tabs.Trigger value="text">Text Styles</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="paint">
							<Table.Root style={{ width: "100%" }}>
								<Table.Body>
									{styles.length > 0 &&
										styles.map((style) => (
											<Table.Row key={style.id}>
												<Table.Cell>
													<Flex align="center" gap="2">
														<Box
															style={{
																backgroundColor: style.css || "black",
																width: "14px",
																height: "14px",
																borderRadius: "50%",
															}}
														/>
														<Text size="2" weight="medium" color="gray">
															{style.name}
														</Text>
													</Flex>
												</Table.Cell>
											</Table.Row>
										))}
								</Table.Body>
							</Table.Root>
						</Tabs.Content>
						<Tabs.Content value="text">
							<Table.Root style={{ width: "100%" }}>
								<Table.Header>
									<Table.Row>
										<Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{textStyles.length > 0 &&
										textStyles.map((style) => (
											<Table.Row key={style.id}>
												<Table.Cell>
													<Flex align="center" gap="2">
														<Text size="2" weight="medium" color="gray">
															{style.name} - {style.fontName.family} -{" "}
															{style.fontSize}
														</Text>
													</Flex>
												</Table.Cell>
											</Table.Row>
										))}
								</Table.Body>
							</Table.Root>
						</Tabs.Content>
					</Tabs.Root>
				</Flex>
			</Box>
		</Theme>
	);
}

export default App;
