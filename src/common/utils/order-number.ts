

export const generateOrderNumber = () =>{
    const timestamp = Date.now();

    return `ORD-${timestamp}`
}