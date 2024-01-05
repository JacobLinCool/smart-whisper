import { manager } from "../dist";

const model = process.argv[2];

(async () => {
	const models = manager.list();
	console.log(models);

	if (model) {
		const name = await manager.download(model);
		const resolved = manager.resolve(name);
		console.log({ name, resolved });
	}
})();
