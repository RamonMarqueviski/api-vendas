import Handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariable {
    [key: string]: string | number;
}

interface IParseMailTemplate {
    file: string;
    variables: ITemplateVariable;
}

class HandlebarsMailTemplate {
    public async parse({
        file,
        variables,
    }: IParseMailTemplate): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });
        const parserTemplate = Handlebars.compile(templateFileContent);

        return parserTemplate(variables);
    }
}

export default HandlebarsMailTemplate;
