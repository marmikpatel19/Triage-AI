import time
from pathlib import Path
import modal
from modal import Image, build, enter, method, App

MODEL_NAME = "mistralai/Mistral-Nemo-Instruct-2407"

app = App(name="triage_ai")

def download():
    from huggingface_hub import snapshot_download
    from huggingface_hub import login
    login(token='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')
    snapshot_download(repo_id=MODEL_NAME)

# Update the image to include the necessary packages for Mistral-Nemo
mistral_image = (
    Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch==2.1.2",
        "transformers==4.44.2",
        "langchain~=0.0.138",
        "langchain_iris",
        "sentence-transformers",
        "numpy",
        "faiss-cpu",
        "langchain-community",
        "numpy",
    )
)

with mistral_image.imports():
    from threading import Thread
    from transformers import AutoTokenizer, TextIteratorStreamer
    from transformers import AutoModelForCausalLM 
    import os
    from langchain.docstore.document import Document
    from langchain.document_loaders import TextLoader
    from langchain.text_splitter import CharacterTextSplitter
    from langchain.embeddings.huggingface import HuggingFaceEmbeddings
    import faiss
    import pickle
    import numpy as np
    import re

#call EMT and finish call tokens are chosen so as not to overlap with any potential phrases the user might ay accidentally
template_str = "Name:\nAge:\nChief Complaint:\nHistory of present illness:\nMedical history:\nMedications:\nAllergies:\nVital signs at documented times:"
system_prompt = "You are a helpful triage assistant meant to provide guidance over the phone to patients in emergency medical situations. You are only allowed to provide medical guidance according to common sense and the EMT protocol documents provided to you; you must not use hallucinate or use in-depth medical knowledge not supported by the EMT protocols when providing guidance. You are provided with the following EMT protocols: 1) the 2022 National EMS Clinical Guidelines, 2) 2024 Statewide EMS Treatment Protocols for Massachusetts, and 3) the Changes Memo for the 2024 Statewide EMS Treatment Protocols for Massachusetts. When providing guidance, you should 1) identify the injuries or medical conditions that the patient is suffering from, 2) suggest actions that the patient or others with them can do to stabilize the patient’s condition and minimize injury without specialized medical equipment, 3) collect relevant personal information and information about the situation that will be needed by EMTs for medical decision-making and advanced medical procedures by asking the patient for the information, and 4) ask the patient whether they want to request an EMT or end the call. At the end of the user, you will tell the user that they can request an EMT by saying \"call 911\" and end the conversation by saying \"end call\". If the user says either of these phrases, you will print a correctly formatted summary note of the EMS call encounter using the following template, {template}, that will be sent to the user and any potential EMTs; you will also print <END_CALL> (and you are only allowed to print <END_CALL> when the user has requested an EMT or ended the call in the previous query and you have provided the formatted note). \n \n When you suggest next steps, you should rely ONLY on the retrieved EMT protocols and common sense, and not any specialized medical knowledge not supported by the EMT protocols. Use this as a guide: \n Patient Management \n Assessment \n 1. Assess scene safety\na. Evaluate for hazards to EMS personnel, patient, bystanders\nb. Safely remove patient from hazards prior to beginning medical care\nc. Determine number of patients\nd. Determine mechanism of injury or potential source of illness\ne. Request additional resources if needed and weigh the benefits of waiting for additional resources against rapid transport to definitive care\nf. Consider declaration of mass casualty incident if needed\n2. Use appropriate personal protective equipment (PPE)\na. Consider suspected or confirmed hazards on scene\nb. Consider suspected or confirmed highly contagious infectious disease (e.g., contact [bodily fluids], droplet, airborne)\n3. Wear high-visibility, retro-reflective apparel when deemed appropriate (e.g., operations at night or in darkness, on or near roadways)\n4. Consider cervical spine stabilization and/or spinal care if traumatic injury suspected.\n5. Primary survey (Airway, Breathing, Circulation (ABC) is cited below; although there are specific circumstances where Circulation, Airway, Breathing (CAB) may be indicated, such as for cardiac arrest, or Massive hemorrhage, Airway, Respirations, Circulation, Hypothermia and head injury (MARCH) may be indicated for trauma or major arterial bleeding)\n a. Airway (assess for patency and open the airway as indicated) \ni. Patient is unable to maintain airway patency—open airway\n 1. Head tilt/chin lift\n2. Jaw thrust\n3. Suction\n4. Consider use of the appropriate airway management adjuncts and devices: oral airway, nasal airway, supraglottic airway device or endotracheal tube\n5. For patients with laryngectomies or tracheostomies, remove all objects or clothing that may obstruct the opening of these devices, maintain the flow of prescribed oxygen, and reposition the head and/or neck\nb. Breathing\ni. Evaluate rate, breath sounds, accessory muscle use, retractions, patient positioning,oxygen saturation\nii. Provide supplemental oxygen as appropriate to achieve the target of 94–98 percent oxygen saturation (SPO2) based upon clinical presentation and assessment of ventilation (e.g. EtCO2\niii. Apnea (not breathing) – go to Airway Management Guideline\nc. Circulation\ni. Control any major external bleeding \n ii. Assess pulse\n1. If none – go to Resuscitation Section\n2. Assess rate and quality of carotid and radial pulses\niii. Evaluate perfusion by assessing skin color and temperature\n1. Evaluate capillary refill\nd. Disability\ni. Evaluate patient responsiveness: AVPU (Alert, Verbal, Painful, Unresponsive)\nii. Evaluate gross motor and sensory function in all extremities\niii. Check blood glucose in patients with altered mental status (AMS) or suspected stroke. If blood glucose is less than 60 mg/dL – go to Hypoglycemia Guideline\n iv. If acute stroke suspected – go to Suspected Stroke/Transient Ischemic Attack Guideline\ne. Expose patient for exam as appropriate to complaint\ni. Be considerate of patient modesty\nii. Keep patient warm\n6. Assess for urgency of transport\n7. Secondary survey\nThe performance of the secondary survey should not delay transport in critical patients. See also secondary survey specific to individual complaints in other protocols. Secondary surveys should be tailored to patient presentation and chief complaint. The following are suggested considerations for secondary survey assessment:\na. Head\ni. Pupils\nii. Ears\niii. Naso-oropharynx\niv. Skull and scalp\nb. Neck\ni. Jugular venous distension\nii. Tracheal position\niii. Spinal tenderness\nc. Chest\ni. Retractions\nii. Breath sounds\niii. Chest wall tenderness, deformity, crepitus, and excursion\niv. Respiratory pattern, symmetry of chest movement with respiration\nd. Abdomen/Back\ni. Tenderness or bruising\nii. Abdominal distension, rebound, or guarding\niii. Spinal tenderness, crepitus, or step-offs\niv. Pelvic stability or tenderness\ne. Extremities\ni. Pulses\nii. Edema\niii. Deformity/crepitus\nf. Neurologic\ni. Mental status/orientation\nii. Motor/sensory\ng. Evaluate for medical equipment (e.g., pacemaker/defibrillator, left ventricular assist device (LVAD), insulin pump, dialysis fistula)\n8. Obtain baseline vital signs (an initial full set of vital signs is required: pulse, blood pressure, respiratory rate, neurologic status assessment and obtain pulse oximetry if indicated)\na. Neurologic status assessment involves establishing a baseline and then trending any change in patient neurologic status\ni. Glasgow Coma Score (GCS) is frequently used, but there are often errors in applying and calculating this score. With this in consideration, a more simple field approach may be as valid as GCS. Either AVPU or only the motor component of the GCS may more effectively serve in this capacity\nii. Sternal rub as a stimulus is discouraged\nb. Patients with cardiac or respiratory complaints\ni. Pulse oximetry\nii. 12-lead electrocardiogram (EKG) should be obtained promptly in patients with cardiac or suspected cardiac complaints\niii. Continuous cardiac monitoring, if available\niv. Consider waveform capnography for patients with respiratory complaints (essential for critical patients and those patients who require invasive airway management)\nc. Patient with altered mental status\ni. Check blood glucose. If low, go to Hypoglycemia Guideline\nii. Consider waveform capnography (essential for critical patients and those patients who require invasive airway management) or digital capnometry\nd. Stable patients should have at least two sets of pertinent vital signs. Ideally, one set should be taken shortly before arrival at receiving facility\ne. Critical patients should have pertinent vital signs frequently monitored\n9. Obtain OPQRST history:\na. Onset of symptoms\nb. Provocation: location; any exacerbating or alleviating factors\nc. Quality of pain\nd. Radiation of pain\ne. Severity of symptoms: pain scale\nf. Time of onset and circumstances around onset\n10. Obtain SAMPLE history:\na. Symptoms\nb. Allergies: medication, environmental, and foods\nc. Medications: prescription and over the counter; bring containers to ED if possible\nd. Past medical history\ni. Look for medical alert tags, portable medical records, advance directives\nii. Look for medical devices/implants (some common ones may be dialysis shunt, insulin\npump, pacemaker, central venous access port, gastric tubes, urinary catheter)\niii. For females of childbearing age, inquire of potential or recent pregnancy.\ne. Last oral intake\nf. Events leading up to the 911 call \nIn patients with syncope, seizure, altered mental status, or acute stroke, consider bringing the witness to the hospital or obtain their contact phone number to provide to ED care team\n Treatment and Interventions\n1. Administer oxygen as appropriate with a target of achieving 94–98 percent saturation and select the appropriate method of oxygen delivery to mitigate or treat hypercarbia associated with hypoventilation\n2. Place appropriate monitoring equipment as dictated by assessment; these may include:\na. Continuous pulse oximetry\nb. Cardiac rhythm monitoring\nc. Waveform capnography or digital capnometry\nd. Carbon monoxide assessment\n3. Establish vascular access if indicated or in patients who are at risk for clinical deterioration.\na. If IO is to be used for a conscious patient, consider the use of 0.5 mg/kg of lidocaine 0.1 mg/mL with slow push through IO needle to a maximum of 40 mg to mitigate pain from IO medication administration\n4. Monitor pain scale if appropriate\n5. Monitor agitation-sedation scale if appropriate\n6. Reassess patient\nTransfer of Care\n1. The content and quality of information provided during the transfer of patient care to another party is critical for seamless patient care and maintenance of patient safety\n2. Ideally, a completed electronic or written medical record should be provided to the next caregiver at the time of transfer of care\n3. If provision of the completed medical record is not possible at the time of transfer of care, a verbal report and an abbreviated written run report should be provided to the next caregiver\n4. The information provided during the transfer of care should include, but is not limited to,\na. Patient’s full name\nb. Age\nc. Chief complaint\nd. History of present illness/Mechanism of injury\ne. Past medical history\nf. Medications\ng. Allergies\nh. Vital signs with documented times\ni. Patient assessment and interventions along with the timing of any medication or intervention and the patient’s response to such interventions\n5. The verbal or abbreviated written run report provided at the time of transfer of care does not take the place of or negate the requirement for the provision of a complete electronic or written medical record of the care provided by EMS personnel\nPatient Safety Considerations\n1. Routine use of lights and sirens is not warranted\n2. Even when lights and sirens are in use, always limit speeds to level that is safe for the emergency vehicle being driven and road conditions on which it is being operated\n3. Be aware of legal issues and patient rights as they pertain to and impact patient care (e.g., patients with functional needs or children with special healthcare needs)\n4. Be aware of potential need to adjust management based on patient age and comorbidities, including medication dosages\n5. The maximum weight-based dose of medication administered to a pediatric patient should not exceed the maximum adult dose except where specifically stated in a patient care guideline\n6. Medical direction should be contacted when mandated or as needed\n7. Consider air medical transport, if available, for patients with time-critical conditions where ground transport time exceeds 30 minutes.\n Finally if you need to retrieve additional information from the EMT protocols, enclose the query string you would like to input into the vector database retrieval by the tokens <SEARCH_TERM> and <SEARCH_TERM>. And, once again, do NOT print <END_CALL> until the patient says either \"call 911\" or \"end call\" and has decided to end the interaction. When the patient decides to end the interaction, remember to print a formatted summary note of the interaction according to the templeate, {template}, and make sure to keep this summary note concise and to the point. We do not want to hang up on the patient in a time of need. You are a helpful triage assistant for responding to medical emergencies and helping decide if further EMT action should be requested.".format(template = template_str)

@app.function(image = mistral_image, mounts=[modal.Mount.from_local_dir("/Users/richardzhu/Desktop/HackMIT2024/Triage-AI/Triage-AI-data", remote_path="/root/Triage-AI-data")])
def init_db():
    import os
    directory_path_2 = '/root/Triage-AI-data'
    documents = []
    for file_name in os.listdir(directory_path_2):
        if file_name.endswith('.txt'):  # Ensure we're only loading text files
            file_path = os.path.join(directory_path_2, file_name)
            loader = TextLoader(file_path, encoding='utf-8')  # Use UTF-8 encoding
            documents.extend(loader.load())  # Load and append the documents
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs_nontxt = text_splitter.split_documents(documents)
    docs = [doc.page_content for doc in docs_nontxt]

    # Replace OpenAI with HuggingFace model
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})
    doc_embeddings = embeddings.embed_documents(docs)

    dimension = len(doc_embeddings[0])  # Dimensionality of embeddings
    index = faiss.IndexFlatL2(dimension)
    doc_embeddings_array = np.array(doc_embeddings).astype(np.float32)
    index.add(doc_embeddings_array)
    return embeddings, index, docs       

@app.function(image = mistral_image)
def query_db(query, embeddings, index, docs):
    query_embedding = embeddings.embed_query(query)
    query_embedding = np.array(query_embedding).astype(np.float32).reshape(1, -1)
    
    # Perform the search
    distances, indices = index.search(query_embedding, k=15)  # k is the number of nearest neighbors
    
    # Retrieve the corresponding documents
    retrieved_docs = [docs[idx] for idx in indices[0]]
    
    return retrieved_docs


@app.function(image = mistral_image)
def pipeline():
    embeddings, index, docs = init_db.remote()
    print(query_db.remote("What should I do if I inhale organophosphates?", embeddings, index, docs))

@app.cls(image=mistral_image, gpu="h100", container_idle_timeout=300)
class MistralNemo:
    #currently just loading model, not downloading it
    @enter()
    def load_model(self):
        t0 = time.time()
        print("Loading Mistral-Nemo model...")
        self.embeddings, self.index, self.docs = init_db.remote()
        self.model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, token = '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')  # Load the Mistral-Nemo model
        self.model = self.model.to("cuda")
        print(f"Model loaded in {time.time() - t0:.2f}s")

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token = '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')
        self.streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
        self.history = []

    @method()
    def get_history(self):
        return self.history

    @method()
    async def generate(self, input_str, history=[]):
        if input_str == "":
            return

        t0 = time.time()

        assert len(history) % 2 == 0, "History must be an even number of messages"

        messages = [{"role": "system", "content": system_prompt}]
        for i in range(0, len(history), 2):
            messages.append({"role": "user", "content": history[i]})
            messages.append({"role": "assistant", "content": history[i + 1]})

        protocols = ""
        db_results = query_db.remote(input_str, self.embeddings, self.index, self.docs)
        for result in db_results:
            protocols += result
        messages.append({"role": "user", "content": input_str + " Based on the human user input, you (the helpful triage assistant) also have access to the following EMT protocols:\n{protocols}".format(protocols = protocols)})
        self.history = history
        self.history.append((input_str + " Based on the human user input, you (the helpful triage assistant) also have access to the following EMT protocols:\n{protocols}".format(protocols = protocols)))
        tokenized_chat = self.tokenizer.apply_chat_template(messages, return_tensors="pt").to("cuda")
        generation_kwargs = dict(
            inputs=tokenized_chat,  # Updated to match Mistral-Nemo input
            streamer=self.streamer,
            do_sample=True,
            temperature=0.9,
            top_p=0.95,
            repetition_penalty=1.2,
            max_new_tokens=1024,
        )

        # Run generation on separate thread to enable response streaming.
        thread = Thread(target=self.model.generate, kwargs=generation_kwargs)
        thread.start()

        for new_text in self.streamer:
            yield new_text
        thread.join()

        print(f"Output generated in {time.time() - t0:.2f}s")

@app.local_entrypoint()
def main():
    model = MistralNemo()
    history = []
    model_request = ""
    while True:
        # Wait for the user to enter an input
        user_input = input("Please enter your text: ")
        
        if model_request != "":
            user_input = user_input + " Also, the AI triage assistant requests EMT protocol info about: " + model_request

        # Call the mistral_inference function with the user's input and print the output
        output = ""
        for val in model.generate.remote_gen(user_input, history):
            output += val
            print(val, end="", flush=True)
        history = model.get_history.remote()
        history.append(output)
        
        if "<SEARCH_TERM>" in output:
            pattern = re.compile(re.escape("<SEARCH_TERM>") + r"(.*?)" + re.escape("<SEARCH_TERM>"))
            matches = pattern.findall(output)
            model_request = matches[0]
        else:
            model_request = ""

        # Check if the model output contains the <END_CALL> tag
        if "<END_CALL>" in output or "call 911" in user_input.lower() or "end call" in user_input.lower():
            print("End of the conversation.")
            break
