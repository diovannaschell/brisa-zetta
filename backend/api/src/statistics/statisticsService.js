const postgresOperator = require("../../database/postgres/postgresOperator");

async function getClientStatistics(clientId, initialDate, finalDate) {
  try {
    // valor total de vendas
    const queryTotalSales = `select 
                        sum(notsai_val_tot) as total
                    from "NOTAS_SAIDAS" n
                    inner join "CLIENTES" c on c.cli_cod = n.cli_cod
                    inner join pessoas p on p.id = c.pessoa
                    where 
                        n.notsai_tpo != 'T' 
                        and n.cli_cod is not null
                        and notsai_dat >= $1
                        and notsai_dat <= $2
                        and p.id = $3`;

    const totalSales = await postgresOperator.getByCursor(queryTotalSales, [
      initialDate,
      finalDate,
      clientId,
    ]);

    // faturamento total
    const queryTotal = `select 
                            sum(notsai_val_tot) as total
                        from "NOTAS_SAIDAS" n
                        inner join "CLIENTES" c on c.cli_cod = n.cli_cod
                        inner join pessoas p on p.id = c.pessoa
                        where 
                            n.notsai_tpo != 'T' 
                            and n.cli_cod is not null
                            and p.id = $1`;

    const totalValue = await postgresOperator.getByCursor(queryTotal, [
      clientId,
    ]);

    // maior venda
    const queryBiggestSell = `select 
                                max(notsai_val_tot) as maior_venda
                            from "NOTAS_SAIDAS" n
                            inner join "CLIENTES" c on c.cli_cod = n.cli_cod
                            inner join pessoas p on p.id = c.pessoa
                            where 
                                notsai_est_can is false
                                and n.cli_cod is not null -- indica o tipo venda
                                and notsai_dat >= $1
                                and notsai_dat <= $2
                                and p.id = $3`;

    const biggestSell = await postgresOperator.getByCursor(queryBiggestSell, [
      initialDate,
      finalDate,
      clientId,
    ]);

    // ticket médio
    const mediumTicketQuery = `select (sum(ns.notsai_val_tot) / count(ns.cli_cod))::numeric(15,2) ticket
                                from "NOTAS_SAIDAS" ns
                                inner join "CLIENTES" c on (c.cli_cod = ns.cli_cod)
                                inner join pessoas p on p.id = c.pessoa
                                where p.id = $1
                                group by ns.cli_cod`;

    const mediumTicket = await postgresOperator.getByCursor(mediumTicketQuery, [
      clientId,
    ]);

    // produtos mais vendidos
    const mostSoldQuery = `select 
                                pr.pro_nom as produto,
                                sum (i.notitesai_qtd) as num_vendas
                            from "NOTAS_SAIDAS" n
                            inner join "NOTA_SAIDA_ITENS" i on i.notsai_cod = n.notsai_cod 
                            inner join "PRODUTOS" pr on pr.pro_cod = i.pro_cod 
                            inner join "CLIENTES" c on c.cli_cod = n.cli_cod
                            inner join pessoas p on p.id = c.pessoa
                            where 
                                notsai_est_can is false
                                and n.cli_cod is not null -- indica o tipo venda
                                and notsai_dat >= $1
                                and notsai_dat <= $2
                                and p.id = $3
                            group by pr.pro_nom    
                            order by num_vendas desc
                            limit 10`;

    const mostSold = await postgresOperator.getByCursor(mostSoldQuery, [
      initialDate,
      finalDate,
      clientId,
    ]);

    // produtos mais vendidos
    const mostExpensiveQuery = `select 
                                    pr.pro_nom as produto,
                                    sum (i.notitesai_val_tot) as total_vendido
                                from "NOTAS_SAIDAS" n
                                inner join "NOTA_SAIDA_ITENS" i on i.notsai_cod = n.notsai_cod 
                                inner join "PRODUTOS" pr on pr.pro_cod = i.pro_cod 
                                inner join "CLIENTES" c on c.cli_cod = n.cli_cod
                                inner join pessoas p on p.id = c.pessoa
                                where 
                                    notsai_est_can is false
                                    and n.cli_cod is not null -- indica o tipo venda
                                    and notsai_dat >= $1
                                    and notsai_dat <= $2
                                    and p.id = $3
                                group by pr.pro_nom    
                                order by total_vendido desc
                                limit 10`;

    const mostExpensive = await postgresOperator.getByCursor(
      mostExpensiveQuery,
      [initialDate, finalDate, clientId]
    );

    return {
      totaVendas: totalSales[0].total,
      totalFaturamento: totalValue[0].total,
      maiorVenda: biggestSell[0].maior_venda,
      ticketMedio: mediumTicket[0].ticket,
      produtosMaisVendidos: mostSold,
      produtosMaiorValor: mostExpensive,
    };
  } catch (error) {
    console.error("Erro na busca das estatisticas", error);
  }
}

module.exports = { getClientStatistics };
