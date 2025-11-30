import { CircleIcon, FaceIcon, SquareIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, Text, Theme } from "@radix-ui/themes";
import { useEffect, useState } from "react";

function App() {
	const [selectionCount, setSelectionCount] = useState(0);

	useEffect(() => {
		window.onmessage = (event: MessageEvent) => {
			const msg = event.data.pluginMessage;
			if (!msg) return;

			switch (msg.type) {
				case "selection-change":
					setSelectionCount(msg.count);
					break;
			}
		};
	}, []);

	const createRectangle = () => {
		parent.postMessage({ pluginMessage: { type: "create-rectangle" } }, "*");
	};

	const createCircle = () => {
		parent.postMessage({ pluginMessage: { type: "create-circle" } }, "*");
	};

	return (
		<Theme accentColor="iris">
			<Box p="4">
				<Flex direction="column" gap="2">
					<Heading size="5" as="h1">
						Figma Plugin
					</Heading>
					<Text size="2">This plugin uses Radix Themes for styling.</Text>
					<Text size="2" color="gray">
						{selectionCount === 0
							? "No items selected"
							: `${selectionCount} item${selectionCount > 1 ? "s" : ""} selected`}
					</Text>

					<Flex direction="column" gap="2">
						<Button onClick={createRectangle}>
							<SquareIcon />
							Create Rectangle
						</Button>
						<Button onClick={createCircle}>
							<CircleIcon />
							Create Circle
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Theme>
	);
}

export default App;
