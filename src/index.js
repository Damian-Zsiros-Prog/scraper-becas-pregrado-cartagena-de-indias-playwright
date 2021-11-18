const { chromium } = require("playwright");
var fs = require("fs");
const allBecasInfo = [];

const getBecasFromInstitutes = async () => {
    const browser = await chromium.launch({
        headless: false,
    });

    const pageBecas = [
        {
            nameProvider: "Mineducacion",
            URIPage:
                "https://www.mineducacion.gov.co/1759/w3-propertyvalue-67093.html?_noredirect=1",
            getInfoBecas: async (page, { nameProvider, URIPage }) => {
                try {
                    const idContainerBecas =
                        "article_i__MEN_po_articuloCompleto_1";
                    const content = await page.textContent(
                        `#${idContainerBecas}`
                    );
                    const contentFormatted = content
                        .replace("1.", "")
                        .replaceAll("\t", "")
                        .split("\n");
                    const becasMinEducacion = [
                        {
                            name: contentFormatted[1],
                            description: `${contentFormatted[3]}. ${contentFormatted[4]}${contentFormatted[5]}`,
                            URLMoreInfo:
                                "https://www.mineducacion.gov.co/1759/w3-propertyvalue-67215.html",
                            nameProvider,
                        },
                    ];
                    becasMinEducacion.forEach((becaMinEducacion) =>
                        allBecasInfo.push(becaMinEducacion)
                    );
                    console.log(
                        `${nameProvider} (${URIPage}): Se obtuvieron las becas correctamente`
                    );
                } catch (error) {
                    console.error(
                        `${nameProvider} (${URIPage}): No se obtuvieron las becas correctamente`
                    );
                    console.error(`${nameProvider} (${URIPage}): ${error}`);
                }
            },
        },
        {
            nameProvider: "Tecnologico Comfenalco",
            URIPage:
                "https://tecnologicocomfenalco.edu.co/opciones-de-financiacion",
            getInfoBecas: async (page, { nameProvider, URIPage }) => {
                try {
                    const selectorContainerBecas = ".gdlr-core-column-30";
                    await page.waitForSelector(`${selectorContainerBecas}`);
                    const content = await page.$$(`${selectorContainerBecas}`);
                    const title = await content[10].innerText();

                    const selectorDescription = `.gdlr-core-accordion-item-content-wrapper`;
                    const contentDescription = await page.$$(
                        `${selectorDescription} .gdlr-core-accordion-item-content p`
                    );

                    const descriptionText =
                        await contentDescription[56].innerText();

                    const becasTecnologicoComfenalco = [
                        {
                            name: title,
                            description: descriptionText,
                            URLMoreInfo: URIPage,
                            nameProvider,
                        },
                    ];
                    becasTecnologicoComfenalco.forEach(
                        (becaTecnologicoComfenalco) =>
                            allBecasInfo.push(becaTecnologicoComfenalco)
                    );
                    console.log(
                        `${nameProvider} (${URIPage}): Se obtuvieron las becas correctamente`
                    );
                } catch (error) {
                    console.error(
                        `${nameProvider} (${URIPage}): No se obtuvieron las becas correctamente`
                    );
                    console.error(`${nameProvider} (${URIPage}): ${error}`);
                }
            },
        },
        {
            nameProvider: "UNINorte",
            URIPage:
                "https://www.uninorte.edu.co/web/donaciones-institucionales/palantecaribe",
            getInfoBecas: async (page, { nameProvider, URIPage }) => {
                try {
                    const selectorContainerBecas = ".journal-content-article p";
                    const content = await page.$$(`${selectorContainerBecas}`);
                    const description =
                        (await content[9].innerText()) +
                        " " +
                        (await content[10].innerText());
                    console.log(description);
                    const becasUNINorte = [
                        {
                            name: `Pa' Lante Caribe`,
                            description,
                            URLMoreInfo: URIPage,
                            nameProvider,
                        },
                    ];
                    becasUNINorte.forEach((becaUNINorte) =>
                        allBecasInfo.push(becaUNINorte)
                    );
                    console.log(
                        `${nameProvider} (${URIPage}): Se obtuvieron las becas correctamente`
                    );
                } catch (error) {
                    console.error(
                        `${nameProvider} (${URIPage}): No se obtuvieron las becas correctamente`
                    );
                    console.error(`${nameProvider} (${URIPage}): ${error}`);
                }
            },
        },
    ];

    pageBecas.forEach(async (pageBeca) => {
        const { nameProvider, URIPage, getInfoBecas } = pageBeca;

        const page = await browser.newPage();
        page.setDefaultTimeout(60000);

        console.log(
            `${nameProvider} (${URIPage}): Navegador Chromiun iniciado`
        );

        await page.goto(URIPage);

        await getInfoBecas(page, {
            nameProvider,
            URIPage,
        });

        await page.screenshot({
            path: `./screenshots/${nameProvider}.png`,
        });

        await page.close();
        await fs.writeFileSync("data/becas.json", JSON.stringify(allBecasInfo));
        console.log(`${nameProvider} (${URIPage}): Se cerro correctamente`);
        console.log({ "Becas obtenidas": allBecasInfo });
    });
};

getBecasFromInstitutes();
