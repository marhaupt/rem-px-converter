<script lang="ts">
    import { browser } from '$app/environment';
    import { DEFAULT_REM_SIZE, LOCAL_STORAGE_REM_BASE_SIZE_KEY } from '$lib/constants';

    export let remSize: number | null;

    const handleBlur = () => {
        if (remSize !== null) {
            return;
        }

        let resetSize = DEFAULT_REM_SIZE;

        if (browser) {
            const remSizeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_REM_BASE_SIZE_KEY);

            if (remSizeFromLocalStorage) {
                resetSize = parseInt(remSizeFromLocalStorage);
            }
        }
        remSize = resetSize;
    };
</script>

<section>
    <span class="rem">1rem</span>
    <span>=</span>
    <div>
        <input
            type="number"
            bind:value={remSize}
            step="1"
            min="1"
            style:width={`${remSize?.toString().length || 2}ch`}
            on:blur={handleBlur}
        />px
    </div>
</section>

<style lang="postcss">
    section {
        display: flex;
        align-items: center;
        justify-content: center;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 1ch;
    }

    .rem {
        text-align: right;
    }

    input {
        background: none;
        color: var(--color-pink);
        border-width: 2px 0;
        border-style: solid;
        border-color: transparent;
        padding: 0;
        outline: none;
        padding: 2px;
        transition-property: color, border-bottom-color;
        transition-duration: 200ms;

        &:focus {
            color: var(--color-white);
            border-bottom-color: var(--color-pink);
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Firefox */
        &[type='number'] {
            -moz-appearance: textfield;
        }
    }
</style>
