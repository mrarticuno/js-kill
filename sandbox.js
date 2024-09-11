import ivm from "isolated-vm";
const isolate = new ivm.Isolate({ memoryLimit: 128 });
const context = isolate.createContextSync();
const jail = context.global;
jail.setSync("global", jail.derefInto());
const hostile = isolate.compileScriptSync(`
	const storage = [];
	const twoMegabytes = 1024 * 1024 * 2;
		console.log('I\\'ve wasted '+ (storage.length * 2)+ 'MB');
`);
const test = hostile.run(context).catch((err) => console.error(err));

console.log(test);
