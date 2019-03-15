<template>
    <div class="progress-content"
        :style="{'text-align': textAlign}">
        <div class="progress-percent"
            :style="{'width': percenter + '%'}">
            {{percenter + '%'}}
        </div>
    </div>
</template>
<script>

let defaults = {
    required: true,
    textAlign: "center",
    intervalTime: 0,
    handlerCallback: function() {}
};

export default {
    name: "v-progress",
    props: ["percent", "textAlign", "intervalTime", "handlerCallback"],
    created() {
        this.textAlign = this.textAlign || defaults.textAlign;
        if(typeof this.handlerCallback != "function") {
            this.handlerCallback = function() {};
        }
    },
    data() {
        return {
            progressTimer: null,
            max: 100,
            percenter: this.percent|| 0
        };
    },
    mounted() {

        clearInterval(this.progressTimer);
        if(this.intervalTime > 0) {
            this.update();
        }
    },
    methods: {
        update() {
            let _this = this;

            this.progressTimer = setInterval(function() {
                _this.setPercent();
            }, this.intervalTime);

        },
        setPercent() {
            if(this.percenter >= this.max) {
                clearInterval(this.progressTimer);
                this.percenter = this.max;
                this.handlerCallback();
                return;
            }
            this.percenter = this.percenter+1;
        }
    }
};
</script>
<style lang="scss">
    .progress-content {
        background: #e7e7e7;
        border-radius: 6px;
        height: 16px;
        .progress-percent {
            height: 100%;
            line-height: 16px;
            padding-right: 6px;
            background-color: $main-active-color;
            color: #fff;
            border-radius: 6px;
            font-size: $font-size-small;
        }
    }
</style>