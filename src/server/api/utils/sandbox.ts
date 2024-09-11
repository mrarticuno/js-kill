import ivm from "isolated-vm";

export async function runCode(
  code: string,
): Promise<ivm.ResultTypeAsync<ivm.ScriptRunOptions, unknown>> {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync("global", jail.derefInto());

  const hostile = await isolate.compileScript(code);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await hostile.run(context);
}
