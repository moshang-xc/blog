<template>
    <div class="container">
        <Statusboard></Statusboard>
        <Cardboard></Cardboard>
        <Success></Success>
    </div>
</template>

<script>

    import Statusboard from "./Statusboard/Statusboard.vue";
    import Cardboard from './card/Cardboard';
    import Success from './box/Success';
    
    import { mapActions } from 'vuex';
    import { STATUS } from '../vuex/store/statusEnum.js';

    export default{
        methods:{
            ...mapActions([
                "reset"
            ])
        },
        created(){
            this.reset();
        },
        components: {Statusboard, Cardboard, Success}
    }
</script>

<style scoped>
    .container{
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background-color: #faf8ef;
        padding: 10px;
        display: flex;
        flex-direction: column;
    }
</style>