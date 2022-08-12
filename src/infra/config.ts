import { config } from "dotenv";
import path from "path";

/**
 * .env
 */
const envFilePath = path.join(
	__dirname,
	`../../env/.env.${process.env.NODE_ENV}`
);
console.log({ envFilePath });
config({ path: envFilePath });

["NODE_ENV", "GRAPHQL_PORT", "APOLLO_KEY", "APOLLO_GRAPH_REF"].forEach((el) => {
	if (!process.env[el]) {
		throw new Error(`${el} is required`);
	}
});

export const { NODE_ENV, GRAPHQL_PORT, APOLLO_KEY, APOLLO_GRAPH_REF } =
	process.env;
