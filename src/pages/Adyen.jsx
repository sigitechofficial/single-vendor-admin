import React, { useLayoutEffect, useRef, useState } from "react";

    const Adyen = () => {
    const [visibleItems, setVisibleItems] = useState([]); // For visible content
    const [overflowingItems, setOverflowingItems] = useState([]); // For overflowing content
    const containerRef = useRef(null);
    const itemRefs = useRef([]); // To store item references
    const [initialRender, setInitialRender] = useState(true);

    const data = [
        1, 2, 3, 4, 45, 56, 7, 7, 8, 8, 9, 9, 0, 9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 1,
        12, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 88, 7, 7, 777,
    ];

    useLayoutEffect(() => {
        const checkOverflow = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            let totalWidth = 0;
            let totalHeight = 0;
            let newVisibleItems = [];
            let newOverflowingItems = [];
            let hasOverflow = false;

            // Iterate through each item and check if it fits within the container
            for (let i = 0; i < data.length; i++) {
            const item = itemRefs.current[i];
            if (item) {
                const itemRect = item.getBoundingClientRect();
                const itemWidth = itemRect.width;
                const itemHeight = itemRect.height;

                totalWidth += itemWidth;
                totalHeight = Math.max(totalHeight, itemHeight); // Track the maximum height in a row

                if (
                totalWidth > containerWidth ||
                totalHeight > containerHeight
                ) {
                hasOverflow = true;
                newOverflowingItems = data.slice(i); // Add the remaining items to overflowing
                break;
                } else {
                newVisibleItems.push(data[i]); // Add visible items
                }
            }
            }
            // Update state only if the visible/overflowing items have changed
            if (initialRender || 
                (JSON.stringify(newVisibleItems) !== JSON.stringify(visibleItems)) ||
                (JSON.stringify(newOverflowingItems) !== JSON.stringify(overflowingItems))) {
            setVisibleItems(newVisibleItems);
            setOverflowingItems(newOverflowingItems);
            setInitialRender(false); // Set initialRender to false after the first render
            }
        }
        };

        checkOverflow(); // Perform the initial check
        window.addEventListener("resize", checkOverflow); // Add resize listener

        return () => {
        window.removeEventListener("resize", checkOverflow); // Cleanup on unmount
        };
    }, [data, visibleItems, overflowingItems, initialRender]); // Add dependencies for state and data

    return (
        <>
        <div
            ref={containerRef}
            className="w-full h-96 bg-black text-white flex gap-4"
            style={{ overflow: 'hidden' }} // Hide scrollbar
        >
            {data.map((itm, i) => (
            <p className="bg-red-500 px-4 py-1 rounded-md cursor-pointer self-center"
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}>
                {itm}
            </p>
            ))}
        </div>

        {overflowingItems.length > 0 && (
            <div className="text-red-500 bg-green-500 p-3 gap-3 flex">
            Content is overflowing! Moved items:
            {overflowingItems.map((itm, i) => (
                <p key={i}>{itm}</p>
            ))}
            </div>
        )}
        </>
    );
    };

    export default Adyen;