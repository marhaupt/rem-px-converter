<script lang="ts">
    import { transformRemToPx } from '$lib/utils';

    let inputValue: string = '';
    let transformedOutput: string | undefined;
    let copied = false;
    let clickX = 0;
    let clickY = 0;

    $: if (inputValue.trim().length > 0) {
        transformedOutput = transformRemToPx(inputValue);
    } else {
        transformedOutput = undefined;
    }

    const copyOutput = (e: MouseEvent) => {
        if (transformedOutput) {
            navigator.clipboard.writeText(transformedOutput).then(() => {
                copied = true;

                clickX = e.clientX;
                clickY = e.clientY;

                setTimeout(() => (copied = false), 200);
            });
        }
    };
</script>

<main>
    <div
        class="copy-notification"
        class:copied
        style:--click-x={`${clickX}px`}
        style:--click-y={`${clickY}px`}
    >
        Copied!
    </div>
    <h1>rem2px</h1>
    <textarea bind:value={inputValue} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <pre
        on:click={copyOutput}
        style:--click-x={`${clickX}px`}
        style:--click-y={`${clickY}px`}
        class:empty={transformedOutput === undefined}
        class:copied>{transformedOutput ?? 'nothing yet'}</pre>
</main>

<style>
    h1 {
        margin-top: 0;
        margin-bottom: 20px;
        grid-column: 1 / -1;
        text-align: center;
        color: var(--color-pink);
        text-shadow: 0 0 10px var(--color-pink);

        @media (width < 500px) {
            margin-bottom: 10px;
        }
    }

    main {
        max-width: 700px;
        margin-inline: auto;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 20px;
        row-gap: 20px;
        font-family: monospace;
        font-size: 16px;
        line-height: 1.8;

        @media (width < 500px) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    textarea {
        position: relative;
        resize: vertical;
        field-sizing: content;
        min-height: 5lh;
        max-height: 10lh;
        padding: 10px 18px;
        font-size: inherit;
        line-height: inherit;
        background-color: var(--color-gray-dark);
        border: 2px solid var(--color-purple);
        outline: none;
        color: var(--color-white);
        transition:
            border-color 200ms ease,
            box-shadow 200ms ease;
        white-space: nowrap;
        border-radius: 4px;

        &:focus {
            border-color: var(--color-pink);
            box-shadow: 0 2px 16px var(--color-pink-alpha60);
        }
    }

    pre {
        margin: 0;
        padding-block: 10px;
        max-width: 100%;
        overflow: scroll;
        transition-property: color;
        transition-timing-function: ease-out;
        transition-duration: 600ms;

        &:not(.empty) {
            cursor: pointer;
        }

        &.empty {
            opacity: 0.5;
        }

        &.copied {
            color: var(--color-pink);
            transition-duration: 50ms;
        }
    }

    .copy-notification {
        display: block;
        background-color: var(--color-purple);
        position: absolute;
        top: var(--click-y);
        left: var(--click-x);
        opacity: 0;
        color: var(--color-white);
        transition-property: opacity;
        transition-timing-function: ease-out;
        transition-duration: 300ms;
        transition-delay: 300ms;
        padding: 6px 16px;
        border-radius: 4px;
        box-shadow: 0 0 12px var(--color-purple);
        translate: -10% -90%;
        pointer-events: none;

        &.copied {
            transition-duration: 50ms;
            transition-delay: 0ms;
            opacity: 1;
        }
    }
</style>
