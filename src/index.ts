import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import {
	subgraph_1_resolver,
	subgraph_2_resolver,
	subgraph_auth_resolver,
} from "./graphql/resolvers";
import { loadFiles } from "@graphql-tools/load-files";
import "./infra/config";
import { GRAPHQL_PORT } from "./infra/config";

const initSubgraph1 = async () => {
	try {
		const server = new ApolloServer({
			resolvers: subgraph_1_resolver,
			typeDefs: await loadFiles(
				__dirname + "/graphql/subgraph_1.graphql"
			),
			debug: true,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
			context: (req) => req,
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
			context: (req) => req,
		});

		const { url } = await server.listen({ port: 1002 });
		console.log(`🚀 Subgraph_2 ready at ${url}`);
	} catch (e) {
		console.log(e);
	}
};

const initSubgraphAuth = async () => {
	try {
		const server = new ApolloServer({
			resolvers: subgraph_auth_resolver,
			typeDefs: await loadFiles(
				__dirname + "/graphql/subgraph_auth.graphql"
			),
			debug: true,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
			context: (req) => req,
		});

		const { url } = await server.listen({ port: 1003 });
		console.log(`🚀 Subgraph_auth ready at ${url}`);
	} catch (e) {
		console.log(e);
	}
};

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
	willSendRequest({ request, context }) {
		request.http.headers.set("authorization", context.authorization);
		request.http.headers.set("entity", context.entity);
	}
}

const initSupergraph = async () => {
	try {
		const gateway = new ApolloGateway({
			buildService({ name, url }) {
				return new AuthenticatedDataSource({ url });
			},
		});

		const server = new ApolloServer({
			gateway,
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
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
		await Promise.all([
			initSubgraph1(),
			initSubgraph2(),
			initSubgraphAuth(),
			initSupergraph(),
		]);
	} catch (e) {
		console.log(e);
	}
};
start();
