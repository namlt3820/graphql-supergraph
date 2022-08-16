import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import { subgraph_1_resolver, subgraph_2_resolver } from "./graphql/resolvers";
import { loadFiles } from "@graphql-tools/load-files";
import "./infra/config";
import { GRAPHQL_PORT } from "./infra/config";
import { CustomApolloServerPlugin } from "./plugin";

const initSubgraph1 = async () => {
	try {
		const server = new ApolloServer({
			resolvers: subgraph_1_resolver,
			typeDefs: await loadFiles(
				__dirname + "/graphql/subgraph_1.graphql"
			),
			debug: true,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
		});

		const { url } = await server.listen({ port: 1001 });
		console.log(`🚀 Subgraph_1 ready at ${url}`);
	} catch (e) {
		console.log(e);
	}
};

const initSubgraph2 = async () => {
	try {
		const server = new ApolloServer({
			resolvers: subgraph_2_resolver,
			typeDefs: await loadFiles(
				__dirname + "/graphql/subgraph_2.graphql"
			),
			debug: true,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
		});

		const { url } = await server.listen({ port: 1002 });
		console.log(`🚀 Subgraph_2 ready at ${url}`);
	} catch (e) {
		console.log(e);
	}
};

const initSupergraph = async () => {
	try {
		const gateway = new ApolloGateway();

		const server = new ApolloServer({
			gateway,
			plugins: [
				ApolloServerPluginLandingPageGraphQLPlayground(),
				new CustomApolloServerPlugin(),
			],
			context: ({ req }) => {
				const { authorization = "", entity = "" } = req.headers;
				return { authorization, entity };
			},
		});

		const { url } = await server.listen({ port: GRAPHQL_PORT });
		console.log(`🚀 Supergraph ready at ${url}`);
	} catch (e) {
		console.log(e);
	}
};

const start = async () => {
	try {
		await Promise.all([initSubgraph1(), initSubgraph2(), initSupergraph()]);
	} catch (e) {
		console.log(e);
	}
};
start();
