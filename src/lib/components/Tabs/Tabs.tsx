import { useInstanceStore } from "@stores";
import { IconPlus } from "@components/icons";
import { Tab } from "./Tab";

export const Tabs = (): JSX.Element => {
    const instances = useInstanceStore((state) => state.instances);
    const addInstance = useInstanceStore((state) => state.addInstance);

    const onPlusClick = () => {
        addInstance();
    };

    return (
        <div className="flex flex-row items-center w-full h-10 border-b border-primary-800">
            {instances.map((instance) => (
                <Tab key={instance.id} instance={instance} />
            ))}
            <IconPlus
                onClick={onPlusClick}
                className="w-8 h-8 p-1 mx-2 cursor-pointer hover:text-primary-600 text-primary-800"
                title="Add Tab"
            />
        </div>
    );
};
