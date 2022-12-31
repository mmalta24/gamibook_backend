const get = {
    "summary": "Lista de categorias",
    "description": "Devolve uma lista de categorias da aplicação",
}

const post = {
    "summary": "Criar níveis",
    "description": "Adiciona um nível à base de dados da aplicação",
}

const getOne = {
    "summary": "Procurar uma conquista",
    "description": "Devolve a informação de uma conquista pelo id",
}

const patch = {
    "summary": "Atualizar o nível",
    "description": "Atualiza alguns campos do nível",
}

const del = {
    "summary": "Apagar conquistas",
    "description": "Apaga uma conquista pelo id",
}


const hint = {
    "/achievements": {
        "get": {
            "summary": "Lista de conquistas",
            "description": "Devolve uma lista de conquistas de acordo com o tipo de utilizador que está a fazer o pedido",
            "operationId": "findAllAchievements",
            "tags": [
                "Conquista",
                "Rotas Privadas - Geral"
            ],
            "security": [
                {
                    "bearer": []
                }
            ],
            "responses": {
                "200": {
                    "$ref": "#/components/responses/achievements/200/findAllAchievements"
                },
                "401": {
                    "$ref": "#/components/responses/general/401/unauthorized"
                }
            }
        },
        "post": {
            "summary": "Criar conquistas",
            "description": "Adiciona uma conquista à base de dados da aplicação",
            "operationId": "createAchievement",
            "tags": [
                "Conquista",
                "Rotas Privadas - Utilizador Administrador"
            ],
            "security": [
                {
                    "bearer": []
                }
            ],
            "requestBody": {
                "$ref": "#/components/requestBodies/achievements/createAchievement"
            },
            "responses": {
                "201": {
                    "$ref": "#/components/responses/achievements/201/createAchievement"
                },
                "400": {
                    "$ref": "#/components/responses/achievements/400/createAchievement"
                },
                "401": {
                    "$ref": "#/components/responses/general/401/unauthorized"
                },
                "403": {
                    "$ref": "#/components/responses/general/403/forbidden"
                },
                "406": {
                    "$ref": "#/components/responses/achievements/406/createAchievement"
                }
            }
        }
    },
    "/achievements/{idAchievement}": {
        "get": {
            "summary": "Procurar uma conquista",
            "description": "Devolve a informação de uma conquista pelo id",
            "operationId": "findOneAchievement",
            "tags": [
                "Conquista",
                "Rotas Privadas - Geral"
            ],
            "security": [
                {
                    "bearer": []
                }
            ],
            "parameters": [
                {
                    "$ref": "#/components/parameters/idAchievement"
                }
            ],
            "responses": {
                "200": {
                    "$ref": "#/components/responses/achievements/200/findOneAchievement"
                },
                "400": {
                    "$ref": "#/components/responses/general/400/idAchievement"
                },
                "401": {
                    "$ref": "#/components/responses/general/401/unauthorized"
                },
                "404": {
                    "$ref": "#/components/responses/general/404/idAchievement"
                }
            }
        },
        "patch": {
            "summary": "Atualizar a conquista",
            "description": "Atualiza alguns campos da conquista",
            "operationId": "updateAchievement",
            "tags": [
                "Conquista",
                "Rotas Privadas - Utilizador Administrador"
            ],
            "security": [
                {
                    "bearer": []
                }
            ],
            "parameters": [
                {
                    "$ref": "#/components/parameters/idAchievement"
                }
            ],
            "requestBody": {
                "$ref": "#/components/requestBodies/achievements/updateAchievement"
            },
            "responses": {
                "200": {
                    "$ref": "#/components/responses/achievements/200/updateAchievement"
                },
                "400": {
                    "$ref": "#/components/responses/achievements/400/updateAchievement"
                },
                "401": {
                    "$ref": "#/components/responses/general/401/unauthorized"
                },
                "403": {
                    "$ref": "#/components/responses/general/403/forbidden"
                },
                "404": {
                    "$ref": "#/components/responses/general/404/idAchievement"
                }
            }
        },
        "delete": {
            "summary": "Apagar conquistas",
            "description": "Apaga uma conquista pelo id",
            "operationId": "deleteAchievement",
            "tags": [
                "Conquista",
                "Rotas Privadas - Utilizador Administrador"
            ],
            "security": [
                {
                    "bearer": []
                }
            ],
            "parameters": [
                {
                    "$ref": "#/components/parameters/idAchievement"
                }
            ],
            "responses": {
                "200": {
                    "$ref": "#/components/responses/achievements/200/deleteAchievement"
                },
                "400": {
                    "$ref": "#/components/responses/general/400/idAchievement"
                },
                "401": {
                    "$ref": "#/components/responses/general/401/unauthorized"
                },
                "403": {
                    "$ref": "#/components/responses/general/403/forbidden"
                },
                "404": {
                    "$ref": "#/components/responses/general/404/idAchievement"
                }
            }
        }
    }
}