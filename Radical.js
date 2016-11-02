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
                                         'peach': ['beach', 'peach'],   
                                          'bees': ['bees', 'peas'],
                                          'peas': ['bees', 'peas'],
                                          'beak': ['beak', 'peak'],
                                          'peak': ['beak', 'peak']},
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
            title: 'DSC 530, Module 2, Assignment 1',
            mainInstructions: ['This fake Human Intelligence Task (HIT) will help familiarize you with the kind of experiment you will run on Amazon Mechanical Turk.'+
                               ' This is an example of an interactive landing page that can be used to inform participants of the requirements for the HIT.'+
                               ' You can click the names below to expand or close each section.'],
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
