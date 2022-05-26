//const database = require("../models");
//const Sequelize = require('sequelize');

const { PessoasServices } = require('../services');
const pessoasServices = new PessoasServices();

class PessoaController {
    static async pegaPessoasAtivas(req, res) {
        try {
            const pessoasAtivas = await pessoasServices.pegaRegistrosAtivos();
            return res.status(200).json(pessoasAtivas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async pegaTodasAsPessoas(req, res) {
        try {
            const todasAsPessoas = await pessoasServices.pegaTodosOsRegistros();
            return res.status(200).json(todasAsPessoas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async pegaUmaPessoa(req, res) {
        const {id} = req.params;

        try {
            const umaPessoa = await database.Pessoas.findOne({where: {id: Number(id)}});
            return res.status(200).json(umaPessoa);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    static async criaPessoa(req, res) {
        const novaPessoa = req.body;

        try {
            const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
            res.status(200).json(novaPessoaCriada);
        } catch (error) {
            res.status(500).json(error.message);
        }
    };

    static async atualizaPessoa(req, res) {
        const novasInfos = req.body;
        const {id} = req.params;
        try {
            await database.Pessoas.update(novasInfos, {where: {id: Number(id)}});
            const pessoaAtualizada = await database.Pessoas.findOne({where: {id: Number(id)}});
            res.status(200).json(pessoaAtualizada);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async apagaPessoa(req, res) {
        const {id} = req.params;
        try {
            await database.Pessoas.destroy({where: {id: Number(id)}});
            res.status(200).send({message: `Pessoa com id ${id} deletada com sucesso!`});
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async restauraPessoa(req, res) {
        const {id} = req.params;
        try {
            await database.Pessoas.restore({where: {id: Number(id)}});
            res.status(200).send({message: `Pessoa com id ${id} restaurada!`});
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async pegaUmaMatricula(req, res) {
        const {estudanteId, matriculaId} = req.params;

        try {
            const umaMatricula = await database.Matriculas.findOne(
                {
                    where: {
                        id: Number(estudanteId),
                        estudante_id: Number(matriculaId)
                    }
                });
            return res.status(200).json(umaMatricula);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    static async criaMatricula(req, res) {
        const {estudanteId} = req.params;
        const novaMatricula = {...req.body, estudante_id: Number(estudanteId)};

        try {
            const novaMatriculaCriada = await database.Matriculas.create(novaMatricula);
            res.status(200).json(novaMatriculaCriada);
        } catch (error) {
            res.status(500).json(error.message);
        }
    };

    static async atualizaMatricula(req, res) {
        const {estudanteId, matriculaId} = req.params;
        const novasInfos = req.body;

        try {
            await database.Matriculas.update(novasInfos, {
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            });

            const matriculaAtualizada = await database.Matriculas.findOne({where: {id: Number(matriculaId)}});
            res.status(200).json(matriculaAtualizada);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async apagaMatricula(req, res) {
        const {estudanteId, matriculaId} = req.params;
        try {
            await database.Matriculas.destroy({
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            });
            res.status(200).send({message: `Matricula com id ${matriculaId} deletada com sucesso!`});
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async restauraMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params
        try {
            await database.Matriculas.restore({
            where: {
                id: Number(matriculaId),
                estudante_id: Number(estudanteId)
            }
            })
            return res.status(200).send({ mensagem: `Matricula com id ${id} restaurada!`})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    static async pegaMatriculas(req, res) {
        const {estudanteId} = req.params;
        try {
           const pessoa = await database.Pessoas.findOne({
               where: {id: Number(estudanteId)}
           })
           const matriculas = await pessoa.getAulasMatriculadas();
           
            res.status(200).json(matriculas);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async pegaMatriculasPorTurma(req, res) {
        const {turmaId} = req.params;
        try {
            const todasAsMatriculas = await database.Matriculas
            .findAndCountAll({
                where: {
                    turma_id: Number(turmaId),
                    status: 'confirmado'
                },
                limit: 20,
                order: [['estudante_id', 'ASC']]
            });
            res.status(200).json(todasAsMatriculas);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async pegaTurmasLotadas(req, res) {
        const lotacaoTurma = 2;
        try {
            const turmasLotadas = await database.Matriculas.findAndCountAll({
                where: {
                    status: 'confirmado'
                },
                attributes: ['turma_id'],
                group: ['turma_id'],
                having: Sequelize.literal(`Count(turma_id) >= ${lotacaoTurma}`)
            });
            res.status(200).json(turmasLotadas);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async cancelaPessoa(req, res) {
        const {estudanteId} = req.params;

        try {
            await pessoasServices.cancelaPessoasEMatriculas(Number(estudanteId));
            res.status(200).send(`Matrículas do estudante com id ${estudanteId} canceladas!`);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

module.exports = PessoaController;