import "@web/components/NavigationComponent";
import { Contact } from "@api/models/Contact";

const submitButton: HTMLInputElement = document.querySelector(".submit") as HTMLInputElement;
const inputName: HTMLInputElement = document.getElementById("name") as HTMLInputElement;
const inputEmail: HTMLInputElement = document.getElementById("email") as HTMLInputElement;
const inputDescription: HTMLInputElement = document.getElementById("description") as HTMLInputElement;

submitButton.addEventListener("click", async () => {
    const name: string = inputName.value;
    const email: string = inputEmail.value;
    const description: string = inputDescription.value;

    if (!name || !email || !description) {
        alert("Vul alle velden in");

        return;
    }

    const body: Contact = {
        name: name,
        email: email,
        description: description,
        created_at: new Date(),
    };

    console.log("Post body: ", body);

    const response: Response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        alert("Uw bericht is verzonden!");
        location.reload();
    }
    else {
        console.error(await response.text());
        alert("Verzenden mislukt!");
    }
});
