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
                               '感谢您对我们实验的兴趣!  这个人类智能任务(Human Intelligentce Task) 是一个关于语言理解的实验。在这个实验中，您将读到一些不完整的句子，.<br><br>'
                                   'Please read through each of the following items that will inform you about the study and its requirements. You can click the names below to expand or close each section.',+
                               'Please read through each of the following items that will inform you about the study and its requirements. You can click the names below to expand or close each section.'
                                   '<span style="font-weight:bold;">Do not take this experiment more than once! </span>',
                              '<span style="font-weight:bold;">Do not take this experiment more than once! </span>'],
            subsections: [
                {
                    title: 'Eligibility requirements',
                    content: ['Any sort of eligibility requirement can be placed here. For instance, we might request participants be native speakers of English,'+
                                   ' or that they wear headphones for the experiment. While we can\'t <strong>really</strong> guarantee that participants actually read'+
                                   ' these requirements, having a more interactive set of instructions can certainly help.'],
                    checkboxText: 'I confirm that I have read the eligibility requirements.'
                },
                {
                    title: 'Listen and type',
                    content: ['For speech perception experiments, we often have an initial sound check that allows the participants to set their volume to'+
                                    ' a comfortable listening level (and allows us to check for at least a basic knowledge of English). Here you can press'+
                                    ' the green button to play a word. Enter it in the space provided in all lowercase letters.',
                              function() {
                                  var soundcheck = new SoundcheckBlock({
                                          items: [
                                              {
                                                  filename: 'stimuli/stimuli_soundcheck/cabbage.wav',
                                                  answer: 'cabbage'
                                              },
                                          ],
                                          instructions: '',
                                  });
                                  return(soundcheck.init());
                              }]
                },
                {
                    title: 'Informed consent',
                    content: e.consentFormDiv,
                    checkboxText: 'I consent to participating in this experiment'
                },
                {
                    title: 'Further (optional) information',
                    content: ['Sometimes it can happen that technical difficulties cause experimental scripts to freeze so that you will not be able to submit a HIT. We are trying our best to avoid these problems. Should they nevertheless occur, we urge you to <a href="mailto:hlplab@gmail.com">contact us</a>, and include the HIT ID number and your worker ID.',
                              'If you are interested in hearing how the experiments you are participating in help us to understand the human brain, feel free to subscribe to our <a href="http://hlplab.wordpress.com/">lab blog</a> where we announce new findings. Note that typically about one year passes before an experiment is published.'],
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
    Papa.parse(experimentList, {
        download: true,
        header: true,
        delimiter: '|',
        skipEmptyLines: true,
        complete: function(results) {
            var stimuli = new ExtendedStimuliFileList({
                prefix: 'stimuli/stimuli_vot/', // Folder where all files will be found
                /* Each of these corresponds to a column in the stimuli file */
                filenames: getFromPapa(results, 'filename'),
                words: getFromPapa(results, 'word'),
                supervised: getFromPapa(results, 'supervised'),
                reps: getFromPapa(results, 'reps')
            });


            /*Create visual world block using the stimuli above*/
            var vwb = new VisworldBlock({stimuli: stimuli,
                                     images: stimImages,
                                     imageMapping: imageMapping,
                                     namespace: 'visualworldblock1',
                                     breakEvery: 5,  //Take a break every x trials
                                     imagePositions: ['left', 'right'],
                                     randomizeImagePositions: true, //Is true by default. If false, then just uses the list order above
                                     randomizationMethod: 'shuffle' //Can also be set to "dont_randomize"
            });
            //Add block to experiment
            e.addBlock({
                block: vwb,
                onPreview: false,
                showInTest: true
            });

            e.nextBlock();
        }
    });
});  
