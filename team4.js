/*
 * Assignment 1: NRT Class
 * Linda Liu, Florian Jaeger (based on code from Dave Kleinschmidt)
 */

$(document).ready(function() {
    /* Instantiate (more or less empty) Experiment:
     * An experiment consists of multiple "blocks", which can be instructions or tasks, followed by a 
     * post-experimental survey(s).
     */
    var e = new Experiment({
            consentForm: 'https://www.hlp.rochester.edu/consent/RSRB45955_Consent_2017-02-10.pdf', //Link to RSRB consent form
            survey: 'surveys/team4-survey.html', //Post-experiment survey that will show up at the very end of the experiment
            cookie: 'team4' //Set cookie as a temporary measure to prevent repeat workers
    });
    e.init(); 
    
    /* Locate the list we should be using for the experiment. 
     * Customize this depending on your needs 
     */
    var experimentList;
    if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '1a') {
        experimentList = 'lists/team4/supervised1a.csv';
    } else if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '1b') {
        experimentList = 'lists/team4/supervised1b.csv';
    } else if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '2a') {
        experimentList = 'lists/team4/supervised2a.csv';
    } else if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '2b') {
        experimentList = 'lists/team4/supervised2b.csv';
    } else if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '3a') {
        experimentList = 'lists/team4/supervised3a.csv';
    } else if (e.urlparams['condition'] == 'sup' & e.urlparams['list'] == '3b') {
        experimentList = 'lists/team4/supervised3b.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '1a') {
        experimentList = 'lists/team4/unsupervised1a.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '1b') {
        experimentList = 'lists/team4/unsupervised1b.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '2a') {
        experimentList = 'lists/team4/unsupervised2a.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '2b') {
        experimentList = 'lists/team4/unsupervised2b.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '3a') {
        experimentList = 'lists/team4/unsupervised3a.csv';
    } else if (e.urlparams['condition'] == 'unsup' & e.urlparams['list'] == '3b') {
        experimentList = 'lists/team4/unsupervised3b.csv';
    }

    /* Image pairs to show for a given word, depending on the condition and whether it is supervised or not*/
    // stimuli words maped to the corresponding images
    var stimImages = {
        beach: 'stimuli/stimuli_images/beach.png',
        peach: 'stimuli/stimuli_images/peach.png',
        bees: 'stimuli/stimuli_images/bees.png',
        peas: 'stimuli/stimuli_images/peas.png',
        beak: 'stimuli/stimuli_images/beak.png',
        peak: 'stimuli/stimuli_images/peak.png'
    };

    //Maps training condition (supervised or not) and word to the two images that should be presented
    var imageMapping = {'unsupervised': {'beach': ['beach', 'peach'],   // all minimal pairs
                                         'peach': ['peach', 'beach'],   
                                          'bees': ['bees', 'peas'],
                                          'peas': ['peas', 'bees'],
                                          'beak': ['beak', 'peak'],
                                          'peak': ['peak', 'beak']},
                          'supervised': {'beach': ['beach', 'peas'],    // all non-minimal pairs
                                         'peach': ['beak', 'peach'],
                                          'bees': ['bees', 'peak'],
                                          'peas': ['beach', 'peas'],
                                          'beak': ['beak', 'peach'],
                                          'peak': ['bees', 'peak']}
                         };
	
    /* Create and add a collapsing instructions block to our experiment */
    var instructions = new InstructionsSubsectionsBlock({
            logoImg: 'logo.png',
            title: 'Listen and click', 
            mainInstructions: ['Thanks for your interest in our study!  This HIT is a psychology experiment about how people understand speech. Your task will be to listen to words, and click on pictures.<br><br>'+
                                   'Please read through each of the following items that will inform you about the study and its requirements. You can click the names below to expand or close each section.',
                                   '<span style="font-weight:bold;">Do not take this experiment more than once! </span>'],
            subsections: [
                {
                    title: 'Experiment Length',
        /*Fill in with your correct info*/
                    content: ['The experiment will take approximately 10 minutes to complete and you will be paid $1.00. You will hear approximately 20-25 words, many of them very similar.'],
                    checkboxText: 'I confirm that I have read this section.'
                },
                {
                    title: 'Native Speaker of American English',
                    content: ['You must be a native speaker of American English. If you have not spent almost all of your time until the age of 10 speaking English and living in the United States, you cannot participate.'],
                    checkboxText: 'I confirm that I am a native American English speaker'
                },
                {
                    title: 'Environment Requirements',
                    content: ['Please complete this HIT in a quiet room, away from other noise and wearing headphones. Please do not look at other web pages or other programs while completing this HIT, as it is very important that you give it your full attention.'],
                    checkboxText: 'I confirm that I have read the eligibility requirements.'
                },
                {
                    title: 'Computer Requirements',
                    content: ['This experiment requires that your browser support JavaScript and that you have working headphones and a mouse (instead of a laptop trackpad).'],
                    checkboxText: 'I confirm that I have read the computer requirements.'
                },
                {
                    title: 'Sound equipment',
                    content: "<font color='red'><strong>It is essential that you wear headphones for this experiment.</strong></font> Otherwise your responses may invalidate our results.<img id='audiopic' src='img/audiotypes.png' />",
                    checkboxText: 'I am wearing headphones right now.'
                },
                {
                    title: 'Sound check',
                    content: ['<font color="red">It is important that you <strong>do not</strong> change your volume during the actual experiment.</font> If you do so, it may be impossible for us to analyze the results we get from you. Press the each green button to play a word, and enter it in the space provided in all lowercase letters.',
                              function() {
                                  var soundcheck = new SoundcheckBlock({
                                          items: [
                                              {
                                                  filename: 'stimuli/stimuli_soundcheck/cabbage.wav',
                                                  answer: 'cabbage'
                                              },
                                              {
                                                  filename: 'stimuli/stimuli_soundcheck/lemonade.wav',
                                                  answer: 'lemonade'
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
                //side: getFromPapa(results, 'side')
            });


            /*Create visual world block using the stimuli above*/
            var vwb = new VisworldBlock({stimuli: stimuli,
                                     images: stimImages,
                                     imageMapping: imageMapping,
                                     namespace: 'visualworldblock1',
                                     breakEvery: stimuli.words.length+1,  //Take a break every x trials
                                     imagePositions: ['left', 'right'],
                                     //imagePositions: stimuli.side,
                                     randomizeImagePositions: true, //Is true by default. If false, then just uses the list order above
                                     randomizationMethod: 'dont_randomize' //Can also be set to "dont_randomize"
            });
            e.addBlock({
                block: vwb,
                onPreview: false,
                showInTest: true
            });
			
            e.nextBlock();
        }
    });
});  
