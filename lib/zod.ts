import { z } from "zod";

/**
 * Ponto único de entrada do Zod (`SEC-013`).
 *
 * O Zod 4 testa `Function("")` para decidir se pode compilar os validadores em
 * JIT. Sob a Content Security Policy esse teste é bloqueado — o Zod apanha a
 * exceção e usa o caminho interpretado, por isso nada parte, mas o browser
 * regista uma violação de `script-src` em cada carregamento. Ruído constante
 * esconde a violação verdadeira no dia em que ela aparecer.
 *
 * Desligar o JIT explicitamente evita a chamada. O custo é nulo à escala deste
 * projeto: os schemas validam frontmatter no build e um punhado de campos no
 * browser, nunca dados em volume.
 *
 * Importar `z` daqui, e não de `"zod"`, garante que a configuração corre antes
 * de qualquer schema ser construído — em todos os bundles.
 */
z.config({ jitless: true });

export { z };
