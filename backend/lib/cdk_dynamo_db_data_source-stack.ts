import * as cdk from '@aws-cdk/core';
import * as ddb from"@aws-cdk/aws-dynamodb"
import * as appsync from "@aws-cdk/aws-appsync"

export class CdkDynamoDbDataSourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this , "step08_dynamodbDatasource" , {
      name : "dynamodb-as-datasource",
      schema : appsync.Schema.fromAsset("graphql/schema.gql") , 
      authorizationConfig : {
        defaultAuthorization : {
      
          authorizationType : appsync.AuthorizationType.API_KEY   ,  
          apiKeyConfig : {
            expires : cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      
      }
    })

    const dynamodbTable = new ddb.Table(this , "dynamoTable" , {
      tableName : "step08_todotable",
      partitionKey : {
        name : "id",
        type : ddb.AttributeType.STRING
      }
    });

    const dataSource = api.addDynamoDbDataSource("datasource" , dynamodbTable );

    dataSource.createResolver({
      typeName : "Mutation",
      fieldName: "addTodo",
      requestMappingTemplate : appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").auto() , 
      appsync.Values.projecting()),
      responseMappingTemplate : appsync.MappingTemplate.dynamoDbResultItem(),
    });


    dataSource.createResolver({
      typeName : "Query",
      fieldName : "todos",
      requestMappingTemplate : appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate : appsync.MappingTemplate.dynamoDbResultList()
    });

    dataSource.createResolver({
      typeName : "Mutation",
      fieldName : "deleteTodo",
      requestMappingTemplate : appsync.MappingTemplate.dynamoDbDeleteItem("id" , "id"),
      responseMappingTemplate : appsync.MappingTemplate.dynamoDbResultItem()
    });

    dataSource.createResolver({
      typeName : "Mutation",
      fieldName : "updateTodo",

      requestMappingTemplate : appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").is("id"),
      appsync.Values.projecting()),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    })


  }
}
