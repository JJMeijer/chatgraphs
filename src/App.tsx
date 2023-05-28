import { Content, Tabs } from "@components";

export const App = (): JSX.Element => {
    return (
        <div className="flex flex-col h-full max-h-screen bg-zinc-800 text-zinc-200">
            <Tabs />
            <Content />
        </div>
    );
};
