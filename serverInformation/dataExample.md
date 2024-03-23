# JSON de exemplo

De momento para consumo e abstração das informações, podem estar usando estas instrução:

```css
select 
    notsai_cod id,
    notsai_dat data,
    notsai_val_tot total,
    case when n.cli_cod is null then 'compra' else 'venda' end tipo,
    n.cli_cod cliente,
    n.for_cod fornecedor,
    p.id pessoa,
    p.*
from "NOTAS_SAIDAS" n
left join "CLIENTES" c on c.cli_cod = n.cli_cod
left join "FORNECEDORES" f on f.for_cod = n.for_cod
left join pessoas p on p.id = coalesce(c.pessoa, f.pessoa)
where 
    notsai_est_can is false
    and notsai_dat >= '2024-03-01'
    and (
        n.cfo_cod = any(get_cfop_compras())
        or
        n.cfo_cod = any(get_cfop_vendas())
    )
```

Com este poderão obter os dados das pessoas, e uso em localizações...

No sql faz a busca sobre os documentos fiscais gerados pela empresa, abstraindo os clientes ou os fornecedores das Notas Fiscais, sendo que Clientes e Fornecedores possuem seus dados de cadastros em Pessoas.
