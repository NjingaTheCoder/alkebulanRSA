"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findOrderDifferences = (ordersArray, // Array of new orders
unchangeArray // Array of unchanged (previous) orders
) => {
    const changedArray = [];
    const unchangedArray = [];
    ordersArray.forEach((newOrder) => {
        // Find the corresponding order in the unchangeArray
        const previousOrder = unchangeArray.find(order => order.id === newOrder.id);
        if (previousOrder) {
            // Check if there are differences in the orderStatus and trackingCode fields only
            const hasChanges = newOrder.checkOutObject.orderStatus !== previousOrder.checkOutObject.orderStatus ||
                newOrder.trackingCode !== previousOrder.trackingCode;
            if (hasChanges) {
                // If there are changes, push to the changedArray
                changedArray.push(newOrder);
            }
            else {
                // If no changes, push to the unchangedArray
                unchangedArray.push(newOrder);
            }
        }
        else {
            // If no corresponding previous order is found, treat it as a changed order (new order case)
            changedArray.push(newOrder);
        }
    });
    return { changedArray, unchangedArray };
};
exports.default = findOrderDifferences;
