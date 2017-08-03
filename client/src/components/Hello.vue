<template>
    <div class="hello">
        <markdown :html="html"
            v-show="!!(html && html.length)"
            ref="markdown"
        />
    </div>
</template>

<script>
import axios from 'axios';
import Markdown from '../widgets/Markdown';

export default {
    name: 'hello',
    data() {
        return {
            html: '',
            error: {
                header: '提示信息',
                message: ''
            }
        };
    },
    methods: {
        async getDoc() {
            try {
                let result = await axios('/api/doc/getDoc', {
                    method: 'get'
                });

                if (result.status === 200 && result.data.status === 0) {
                    let data = result.data.data;
                    this.html = data.doc.html;
                }
                else {
                    this.error.message = '糟糕！找不到相应的文档...';
                    this.error.show = true;
                }
            }
            catch (e) {
                this.error.message = '糟糕！网络发生了点错误...';
                this.error.show = true;
            }
        }
    },
    created() {
        document.title = this.$route.meta.title;
        this.getDoc();
    },
    components: {
        Markdown
    }
};
</script>
