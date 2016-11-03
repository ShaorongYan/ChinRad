/* Original File: 
 * Assignment 1: NRT Class
 * Linda Liu, Florian Jaeger (based on code from Dave Kleinschmidt)
 */
 
/*
 * Adopted for Radica Normaling
 * Shaorong Yan 
 */ 

$(document).ready(function() {

    /* Instantiate (more or less empty) Experiment:
     * An experiment consists of multiple "blocks", which can be instructions or tasks, followed by a 
     * post-experimental survey(s).
     */
    
    var e = new Experiment({
            consentForm: 'https://www.hlp.rochester.edu/mturk/consent/RSRB_24018_Consent_Current.pdf', //Link to RSRB consent form
            survey: 'surveys/Radical-Survey.html', //Post-experiment survey that will show up at the very end of the experiment
            cookie: 'ChinRad' //Set cookie as a temporary measure to prevent repeat workers
    });
 
    e.init(); 
    
    /* Locate the list we should be using for the experiment. 
     * Customize this depending on your needs 
     */
    var experimentList;
    
    if (e.urlparams['condition'] == 'mock_experiment') {
        experimentList = 'lists/sample.csv';
    }

    /* Create and add a collapsing instructions block to our experiment */
    var instructions = new InstructionsSubsectionsBlock({
            logoImg: 'logo.png',
            title: 'Norming Study',
            mainInstructions: ['Thanks for your interest in our study!  This HIT is a psychology experiment about how people comprehend sentences. In this experiment, you will see fragments of sentences, and your task is to choose which you think is the next word of the sentence. Please don’t try to be overly creative and just choose with your immediate impression.
 <br><br>'+
                               '感谢您对我们实验的兴趣!  这个人类智能任务(Human Intelligentce Task) 是一个关于语言理解的实验。在这个实验中，您将读到一些不完整的句子。您的任务是选择您认为是句子即将出现的下一个词。请不要想太多，并遵循您的第一印象进行选择。<br><br>'+ 
                               'Please read through each of the following items that will inform you about the study and its requirements. You can click the names below to expand or close each section.',+
                               '请通读下面的每一项内容，这些内容会包含了对这项研究和要求的内容。你可以点击每一项的名称，来展开每一个子菜单。',+
                                   '<span style="font-weight:bold;">Do not take this experiment more than once! </span>',
                              '<span style="font-weight:bold;">请不要重复参加我们的实验！ </span>'],
 subsections: [
                {
                    title: 'Experiment Length   实验长度',
        /*Fill in with your correct info*/
                    content: ['The experiment will take approximately 20 minutes to complete and you will be paid $1.00. You will read 36 sentence frames and choose what you think is the next word of the sentence.'+
                             '本实验时长大概20分钟。您的报酬将会是1美元($1.00)。您将读到36个不完整的句子并选择你认为哪一个词是句子即将出现的下一个词。'],
                    checkboxText: 'I confirm that I have read this section. 我确认已阅读这一部分。'
                },
                {
                    title: 'Native Speaker of Chinese 中文母语者',
                    content: ['To participate, you must be a native speaker of Chinese and competent in reading simplified Chinese. If you have not spent almost all of your time until the age of 15 speaking Chinese and living in the mainland China, you cannot participate.'+
                             '想参加这个实验，您必须是中文母语者并且能熟练阅读简体中文。如果您在十五岁之前大部分时间没有使用中文，或居住在中国大陆，您将不能参加本实验。'],
                    checkboxText: 'I confirm that I am a native Chinese speaker and read simplified Chinese. 我确认我是中文母语者并且阅读简体中文。'
                },
                {
                    title: 'Environment Requirements 环境要求',
                    content: ['Please complete this HIT in a quiet room, away from other noise. Please do not look at other web pages or other programs while completing this HIT, as it is very important that you give it your full attention.'+
                             '请在一间安静无噪音的屋子完成本人类智能任务。请不要在完成此任务的同事浏览其他网页或其他程序。您的注意对于我们的实验十分重要。'],
                    checkboxText: 'I confirm that I have read the environment requirements. 我确认我已经阅读环境要求。'
                },
                {
                    title: 'Computer Requirements 电脑要求',
                    content: ['This experiment requires that your browser support JavaScript.'+
                             '本实验需要您的浏览器支持JavaScript。'],
                    checkboxText: 'I confirm that I have read the computer requirements. 我确认我已阅读电脑要求。'
                },
                {
                    title: 'Informed consent 知情同意',
                    content: e.consentFormDiv,
                    checkboxText: 'I consent to participating in this experiment 我已阅读知情同意并同意参加本次实验。'
                },
                {
                    title: 'Further (optional) information 其他信息',
                    content: ['Sometimes it can happen that technical difficulties cause experimental scripts to freeze so that you will not be able to submit a HIT. We are trying our best to avoid these problems. Should they nevertheless occur, we urge you to <a href="mailto:hlplab@gmail.com">contact us</a>, and include the HIT ID number and your worker ID.',
                              '由于网络原因有时候实验程序可能会中断以致于您无法提交完成的任务。我们已经尽我们最大的努力来避免这些问题。如果类似的问题发生了，我们希望您<a href="mailto:hlplab@gmail.com">联系我们</a>，并附上HIT ID号码以及您的worker ID.',
                              'If you are interested in hearing how the experiments you are participating in help us to understand the human brain, feel free to subscribe to our <a href="http://hlplab.wordpress.com/">lab blog</a> where we announce new findings. Note that typically about one year passes before an experiment is published.',
                             '如果您有兴趣了解您参加的实验是如何帮助我们了解人类的大脑袋，欢迎订阅我们实验室的<a href="http://hlplab.wordpress.com/">网络日志</a>。我们会在那里介绍我们最新的发现。通常在实验结束一年之后实验的结果才会发布。',],
                    finallyInfo: true
                }],
    });
             
    e.addBlock({block: instructions,
                onPreview: true,
                showInTest: false //showInTest: when urlparam for mode=test, don't add the block
    });  // onPreview = true for blocks that can be viewed BEFORE the worker accepts a HIT. To get an idea of what this means, try to go through the HIT without accepting it and see how far you get

     /* Create some stimuli. The only requirement is that you provide this with a list of filenames. 
      * It can include what ever else you want.
      * We use papa.parse to read the csv file that contains the list we want to use
      */
    
     e.nextBlock();
    
});  
