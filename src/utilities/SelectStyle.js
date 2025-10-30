// @ts-nocheck
const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        background: "transparent",
        outline: "none",
        boxShadow: state.isFocused ? `0 0 0 1px lightGray` : "none",
        cursor: "pointer",
        border: "1px solid #E2E8F0",
        borderRadius: "6px",
        paddingTop: "3px",
        paddingBottom: "3px",
        "&:hover": {
            border: "1px solid #E2E8F0",
        },
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? "lightGray" : "lightGray",
        "&:hover": {
            color: "lightGray",
        },
    }),
};

export default selectStyles;