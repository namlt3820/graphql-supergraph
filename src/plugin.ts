import {
	ApolloServerPlugin,
	BaseContext,
	GraphQLRequestContext,
	GraphQLRequestListener,
	GraphQLResponse,
} from "apollo-server-plugin-base";

class CustomApolloServerPlugin implements ApolloServerPlugin {
	public requestDidStart():
		| Promise<GraphQLRequestListener<BaseContext>>
		| any {
		return {
			responseForOperation(
				context: GraphQLRequestContext
			): GraphQLResponse | any {
				const { operationName } = context;
				const { authorization = "" } = context.context;

				if (operationName === "IntrospectionQuery") return null;

				return authorization === "Bearer"
					? null
					: {
							data: {
								message: "Authen failed",
							},
					  };
			},
		};
	}
}

export { CustomApolloServerPlugin };
