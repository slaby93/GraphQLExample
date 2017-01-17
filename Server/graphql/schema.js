const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLUnionType,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = require('graphql');

// Test Schema
const TestEnum = new GraphQLEnumType({
    name: 'TestEnum',
    values: {
        RED: {description: 'A rosy color'},
        GREEN: {description: 'The color of martians and slime'},
        BLUE: {description: 'A feeling you might have if you can\'t use GraphQL'},
    }
});

const TestInputObject = new GraphQLInputObjectType({
    name: 'TestInput',
    fields: () => ({
        string: {
            type: GraphQLString,
            description: 'Repeats back this string'
        },
        int: {type: GraphQLInt},
        float: {type: GraphQLFloat},
        boolean: {type: GraphQLBoolean},
        id: {type: GraphQLID},
        enum: {type: TestEnum},
        object: {type: TestInputObject},
        // List
        listString: {type: new GraphQLList(GraphQLString)},
        listInt: {type: new GraphQLList(GraphQLInt)},
        listFloat: {type: new GraphQLList(GraphQLFloat)},
        listBoolean: {type: new GraphQLList(GraphQLBoolean)},
        listID: {type: new GraphQLList(GraphQLID)},
        listEnum: {type: new GraphQLList(TestEnum)},
        listObject: {type: new GraphQLList(TestInputObject)},
    })
});

const TestInterface = new GraphQLInterfaceType({
    name: 'TestInterface',
    description: 'Test interface.',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'Common name string.'
        }
    }),
    resolveType: check => {
        return check ? UnionFirst : UnionSecond;
    }
});

const UnionFirst = new GraphQLObjectType({
    name: 'First',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'Common name string for UnionFirst.'
        },
        first: {
            type: new GraphQLList(TestInterface),
            resolve: () => {
                return true;
            }
        }
    }),
    interfaces: [TestInterface]
});

const UnionSecond = new GraphQLObjectType({
    name: 'Second',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'Common name string for UnionFirst.'
        },
        second: {
            type: TestInterface,
            resolve: () => {
                return false;
            }
        }
    }),
    interfaces: [TestInterface]
});

const TestUnion = new GraphQLUnionType({
    name: 'TestUnion',
    types: [UnionFirst, UnionSecond],
    resolveType() {
        return UnionFirst;
    }
});

const TestType = new GraphQLObjectType({
    name: 'Root',
    fields: () => ({
        test: {
            type: TestType,
            description: '`test` field from `Test` type.',
            resolve: () => ({})
        },
        union: {
            type: TestUnion,
            description: '> union field from Test type, block-quoted.',
            resolve: () => ({})
        },
        id: {
            type: GraphQLID,
            description: 'id field from Test type.',
            resolve: () => 'abc123',
        },
        isTest: {
            type: GraphQLBoolean,
            description: 'Is this a test schema? Sure it is.',
            resolve: () => {
                return true;
            }
        },
        hasArgs: {
            type: GraphQLString,
            resolve(value, args) {
                return JSON.stringify(args);
            },
            args: {
                string: {type: GraphQLString},
                int: {type: GraphQLInt},
                float: {type: GraphQLFloat},
                boolean: {type: GraphQLBoolean},
                id: {type: GraphQLID},
                enum: {type: TestEnum},
                object: {type: TestInputObject},
                // List
                listString: {type: new GraphQLList(GraphQLString)},
                listInt: {type: new GraphQLList(GraphQLInt)},
                listFloat: {type: new GraphQLList(GraphQLFloat)},
                listBoolean: {type: new GraphQLList(GraphQLBoolean)},
                listID: {type: new GraphQLList(GraphQLID)},
                listEnum: {type: new GraphQLList(TestEnum)},
                listObject: {type: new GraphQLList(TestInputObject)},
            }
        },
        user: {
            type: User,
            description: 'Polish Bank User',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (value, args) => {
                console.log('value', value)
                console.log('args', args.id)
                const result = [
                    {
                        name: "Daniel",
                        age: 23,
                        id: 1
                    },
                    {
                        name: "Arkadiusz",
                        age: 12,
                        id: 2
                    },
                    {
                        name: "Igor",
                        age: 45,
                        id: 3
                    }
                ].filter(item =>{
                    console.log('item', item.id == args.id)
                    return  item.id == args.id
                })[0];
                return result
            }
        }
    })
});

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'User Name'
        },
        age: {
            type: GraphQLInt,
        }
    })
})

const TestMutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'This is a simple mutation type',
    fields: {
        setString: {
            type: GraphQLString,
            description: 'Set the string field',
            args: {
                value: {type: GraphQLString}
            }
        }
    }
});

const TestSubscriptionType = new GraphQLObjectType({
    name: 'SubscriptionType',
    description: 'This is a simple subscription type',
    fields: {
        subscribeToTest: {
            type: TestType,
            description: 'Subscribe to the test type',
            args: {
                id: {type: GraphQLString}
            }
        }
    }
});

const myTestSchema = new GraphQLSchema({
    query: TestType,
    mutation: TestMutationType,
    subscription: TestSubscriptionType
});

/**
 run server // npm start
 http://localhost:3000/graphiql/
 query{
  user(id:3){
    name
    age
  }
}


 */


module.exports = myTestSchema;