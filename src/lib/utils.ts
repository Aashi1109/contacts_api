export const jnstringify = (data: any) => JSON.stringify(data);

export const jnparse = (data: any) => JSON.parse(data);

export const isProductionEnv = () => process.env.NODE_ENV === "production";
