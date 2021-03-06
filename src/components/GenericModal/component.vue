<template>
    <div>
        <div v-show="value" class="modal-bg" @click="onBgClick" :style="bgStyle"></div>
        <div ref="content" class="modal-ct" v-show="value" :transition="transition" :style="[contentStyle,ctStyle]">
            <header v-if="!onlyBody" class="modal-ct-head">
                <p class="modal-ct-title">{{ title }}</p>
                <button class="delete" @click="hide"></button>
            </header>
            <section class="modal-ct-body" :style="bodyStyle">
                <slot></slot>
            </section>
            <footer v-if="!onlyBody" class="modal-ct-foot clearfix">
                <div class="fright">
                    <a class="button" @click="cancel">{{ cancelText }}</a>
                    <a class="button is-primary" @click="ok">{{ okText }}</a>
                </div>
            </footer>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {
                type: String,
                default:'Modal'
            },
            okText: {
                type: String,
                default: 'Ok'
            },
            cancelText: {
                type: String,
                default: 'Cancel'
            },
            value: {
                type: Boolean,
                default: false
            },
            transition: {
                type: String,
                default: 'bounce'
            },
            verify: {
                type: Boolean,
                default: false
            },
            bgClick: {
                type: Boolean,
                default: true
            },
            onlyBody: {
                type: Boolean,
                default: false
            },
            bgStyle:{
                type:Object,
                default(){
                    return {};
                }
            },
            contentStyle:{
                type:Object,
                default(){
                    return {};
                }
            },
            bodyStyle:{
                type:Object,
                default(){
                    return {};
                }
            },
            modalId:{
                type: Number,
                default:''
            },
            topGap:{
                type: Number,
                default:0
            },
            MODAL_CANCEL_EVENT: {
                type: Function
            },
            MODAL_OK_EVENT: {
                type: Function
            }
        },
        data(){
            return {
                ctStyle: {}
            }
        },
        watch: {
            value(){
                if (this.value) {
                    this.computeStyle();
                }
            }
        },
        ready(){
            this.bind(window,"resize",function(){
                this.computeStyle();
            }.bind(this));
        },
        methods: {
            show () {
                this.$emit('input', true);
            },
            hide () {
                this.$emit('input', false);
            },
            onBgClick(){
                if (this.bgClick) {
                    this.hide();
                }
            },
            ok () {
                if (!this.verify) {
                    this.hide();
                }
                this.$emit(`MODAL_OK_EVENT`,this.modalId)
            },
            cancel () {
                this.hide();
                this.$emit(`MODAL_CANCEL_EVENT`,this.modalId)
            },
            computeStyle(){
                if(!this.$refs.content || !this.$refs.content.offsetHeight){
                    return;
                }
                this.ctStyle = {
                    top: `${Math.max((window.innerHeight - this.$refs.content.offsetHeight) / 2 - this.topGap ,0)}px`,
                    left: `${Math.max((window.innerWidth - this.$refs.content.offsetWidth) / 2,0)}px`
                }
            },
            bind(el,eventName,fn){
                if (window.addEventListener) {
                    el.addEventListener(eventName, fn,false);
                } else if (window.attachEvent) {
                    el.attachEvent("on" + eventName, fn);
                }
            }
        }
    }
    </script>

<style>
    .modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 5000;
    }
    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        _overflow: hidden;
    }
    .fright{
        float:right;
    }
    button,.button{
        background-color: #fff;
        border: 1px solid #d3d6db;
        border-radius: 3px;
        color: #222324;
        font-size: 14px;
        height: 32px;
        line-height: 24px;
        padding:8px 10px;
        position: relative;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
    &:hover{
         color: #222324;
         border-color: #aeb1b5;
     }
    }
    .modal-ct {
        position: fixed;
        background-color: #fff;
        width: 640px;
        border-radius: 5px;
        z-index: 5001;

    .modal-ct-head {
        position: relative;
        padding: 15px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #d3d6db;
        border-top-left-radius:5px;
        border-top-right-radius:5px;
    .delete {
        -webkit-appearance: none;
        background-color: rgba(18, 18, 18, 0.2);
        border: none;
        border-radius: 100%;
        cursor: pointer;
        display: inline-block;
        height: 24px;
        width: 24px;
        position: absolute;
        top: 15px;
        right: 10px;
    &:before {
         background-color: #fff;
         content: "";
         display: block;
         height: 2px;
         left: 50%;
         margin-left: -25%;
         margin-top: -1px;
         position: absolute;
         top: 50%;
         width: 50%;
         -webkit-transform: rotate(45deg);
         transform: rotate(45deg);
     }
    &:after {
         background-color: #fff;
         content: "";
         display: block;
         height: 2px;
         left: 50%;
         margin-left: -25%;
         margin-top: -1px;
         position: absolute;
         top: 50%;
         width: 50%;
         -webkit-transform: rotate(-45deg);
         transform: rotate(-45deg);
     }
    &:hover {
         background-color: rgba(17, 17, 17, 0.5);
     }
    }
    .modal-ct-title {
        color: #222324;
        font-size: 20px;
        line-height: 1;
        margin: 0;
        padding: 0;
    }
    }

    .modal-ct-body {
        max-height: 450px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px;
    }

    .modal-ct-foot {
        position: relative;
        padding: 15px;
        background-color: #f5f7fa;
        border-top: 1px solid #d3d6db;
        border-bottom-left-radius:5px;
        border-bottom-right-radius:5px;
    .actions{
        position: absolute;
        right:15px;
        top:15px;
    }
    .is-primary{
        background-color: #1fc8db;
        border-color: transparent;
        color: #fff;
        margin-left:5px;
    &:hover{
         background-color: #199fae;
         border-color: transparent;
         color: #fff;
     }
    }
    .button{
        min-width:70px;
    }
    }

    }
    .bounce-transition {
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .bounce-enter {
        animation-name: bounceIn;
    }

    .bounce-leave {
        animation-name: bounceOut;
    }

    @-webkit-keyframes bounceIn {
        from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }

        0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }

        20% {
            transform: scale3d(1.1, 1.1, 1.1);
        }

        40% {
            transform: scale3d(.9, .9, .9);
        }

        60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
        }

        80% {
            transform: scale3d(.97, .97, .97);
        }

        to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }

    @keyframes bounceIn {
        from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }

        0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }

        20% {
            transform: scale3d(1.1, 1.1, 1.1);
        }

        40% {
            transform: scale3d(.9, .9, .9);
        }

        60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
        }

        80% {
            transform: scale3d(.97, .97, .97);
        }

        to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }

    @-webkit-keyframes bounceOut {
        20% {
            transform: scale3d(.9, .9, .9);
        }

        50%, 55% {
            opacity: 1;
            transform: scale3d(1.1, 1.1, 1.1);
        }

        to {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }
    }

    @keyframes bounceOut {
        20% {
            transform: scale3d(.9, .9, .9);
        }

        50%, 55% {
            opacity: 1;
            transform: scale3d(1.1, 1.1, 1.1);
        }

        to {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }
    }
</style>
