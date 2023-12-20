<script lang="ts">
    import { transformRemToPx } from '$lib/utils';

    let inputValue: string = '';
    let transformedOutput: string | undefined;

    $: if (inputValue.trim().length > 0) {
        transformedOutput = transformRemToPx(inputValue);
    } else {
        transformedOutput = undefined;
    }

    const copyOutput = () => {
        if (transformedOutput) {
            navigator.clipboard.writeText(transformedOutput).then(() => {
                console.log("Copied!")
            })
        }
    };
</script>

<main>
    <h1>rem2px</h1>
    <textarea bind:value={inputValue} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <pre on:click={copyOutput}>{transformedOutput ?? 'nothing yet'}</pre>
</main>

<style>
    h1 {
        margin-top: 0;
        margin-bottom: 20px;
        grid-column: 1 / -1;
        text-align: center;
        
        @media(width < 500px) {
            margin-bottom: 10px;
        }
    }

    main {
        max-width: 700px;
        padding-top: 20px;
        margin-inline: auto;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 20px;
        row-gap: 20px;
        font-family: monospace;
        font-size: 16px;
        line-height: 1.4;

        @media(width < 500px) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    textarea {
        resize: vertical;
        field-sizing: content;
        min-height: 4lh;
        max-height: 8lh;
        padding: 10px 18px;
        font-size: inherit;
        line-height: inherit;
    }

    pre {
        margin: 0;
        padding-block: 10px;
        max-width: 100%;
        overflow: scroll;
        cursor: pointer;
    }
</style>
