import { Notice, Plugin, requestUrl } from 'obsidian';


export default class StashpadDocsPlugin extends Plugin {

	async onload() {
		this.addRibbonIcon('external-link', 'Share to Stashpad Docs', () => {
			this.shareToStashpadDocs();
		});

		this.addCommand({
			id: 'share-to-stashpad-docs',
			name: 'Share to Stashpad Docs',
			callback: () => {
				this.shareToStashpadDocs();
			},
		})
	}

	async shareToStashpadDocs() {
		const notice = new Notice('Creating a new Stashpad Doc...');
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile || !activeFile.name) return;
		const text = await this.app.vault.read(activeFile);
		const title = activeFile.name.split('.md')[0];
		const content = `# ${title}\n${text}`;
		const response = await requestUrl({
			url: 'https://api.stashpad.live/v1/docs',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				content,
			}),
		});
		const responseJson = response.json
		if (!responseJson.ok) {
			notice.setMessage('An error occurred.');
			return;
		}
		notice.setMessage('New Stashpad Doc created.');
		window.open(responseJson.uri);
	}
}
