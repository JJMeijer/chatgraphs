import { IconProps } from "@types";

export const IconArrowRight = (props: IconProps): JSX.Element => {
    return (
        <div {...props}>
            <svg className="w-full h-full " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </div>
    );
};
