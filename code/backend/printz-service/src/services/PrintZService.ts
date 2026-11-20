export class PrintZService {
    async getAllOrders() {
        //alle orders met status printz ophalen
        return []
    }

    async CreatePrintJob() {
        //maak een nieuwe printjop voor een item
    }

    async CreateShipment() {
        // maak een nieuwe shipment waaneer de order klaar is om naar de klant te versturen
    }
}

export const printZService = new PrintZService();
