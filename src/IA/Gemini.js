const { ejecutarSQLQuery } = require("../mysql.js");
const { SQL_PROMPT } = require("./Config.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function ejecutarQuery(query) {
    console.log('Query a ejecutar:', query);
    try {
        const result = await ejecutarSQLQuery(query);
        console.log("Resultado:", result);
        return {
            success: true,
            message: "Query ejecutado correctamente",
            query: query,
            result: result
        }
    } catch (error) {
        console.error("Error al ejecutar query:", error);
        return {
            success: false,
            message: "Error al ejecutar query",
            query: query,
            error: error
        };
    }
}

const functions = {
    EjecutarSQLQuery: async ({ Query }) => {
        return await ejecutarQuery(Query);
    }
};

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: SQL_PROMPT,
    tools: [
        {
            functionDeclarations: [
                {
                    name: "EjecutarSQLQuery",
                    description: "Ejecuta query en la base de datos, se necesita la consulta en string, y devolverá los datos correspondientes a esta consulta. Se usará siempre que el usuario haga una pregunta que requiera una consulta sql.",
                    parameters: {
                        type: "object",
                        properties: {
                            Query: {
                                type: "string"
                            }
                        },
                        required: ["Query"]
                    }
                }
            ]
        }
    ],
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

let mensajes = [];

const enviarMensajeGemini = async (mensaje) => {
    if(mensajes.length > 100){
        limpiarMensajes();
        return "has superado el limite de mensajes";
    }
    
    const chat = await model.startChat({generationConfig, history:mensajes});
    const result = await chat.sendMessage(mensaje);
    const functionCalls = await result.response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
        let allResults = [];
        
        // Ejecutar cada llamada a función secuencialmente
        for (const functionCall of functionCalls) {
            console.log("Ejecutando función:", functionCall.name);
            const queryResult = await functions[functionCall.name](functionCall.args);
            allResults.push({
                functionResponse: {
                    name: functionCall.name,
                    response: {
                        name: functionCall.name,
                        content: queryResult
                    }
                }
            });
        }
        
        // Enviar todos los resultados de vuelta al modelo en una sola llamada
        const finalResult = await chat.sendMessage(allResults);
        return await finalResult.response.text();
    }

    return await result.response.text();
};

const ResetChat = () => {
    mensajes = [];
}

const ObtenerChat = () => {
    return mensajes;
}

module.exports = {
    enviarMensajeGemini,
    ObtenerChat,
    ResetChat
}