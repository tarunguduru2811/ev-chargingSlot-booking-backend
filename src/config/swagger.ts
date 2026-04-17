import path from "node:path"
import YAML from "yamljs"
import swaggerUi from "swagger-ui-express";


const swaggerDocument = YAML.load(
    path.join(__dirname,"../docs/swagger.yaml")
)


export const swaggerDocs = (app:any) => {
    app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}