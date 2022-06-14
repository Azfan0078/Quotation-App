async function loadUrl(window, rote) {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
        await window.loadURL(`app://./${rote}.html`);
    } else {
        const port = process.argv[2];

        await window.loadURL(`http://localhost:${port}/${rote}`);
    }
}
export default loadUrl