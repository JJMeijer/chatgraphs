interface CounterProps {
    title: string;
    value: number | string;
}

export const Counter = (props: CounterProps): JSX.Element => {
    const { title, value } = props;
    return (
        <div className="flex flex-col w-44 py-2 px-4">
            <div className="text-base">{title}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
};
