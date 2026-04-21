#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* prev;
    Node* next;

    Node(int val) {
        data = val;
        prev = NULL;
        next = NULL;
    }
};


void insertBegin(Node* &head, int val) {
    Node* newNode = new Node(val);

    if (head != NULL) {
        newNode->next = head;
        head->prev = newNode;
    }
    head = newNode;
}


void insertEnd(Node* &head, int val) {
    Node* newNode = new Node(val);

    if (head == NULL) {
        head = newNode;
        return;
    }

    Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->next = newNode;
    newNode->prev = temp;
}

void deleteBegin(Node* &head) {
    if (head == NULL) {
        cout << "List is empty\n";
        return;
    }

    Node* temp = head;
    head = head->next;

    if (head != NULL) {
        head->prev = NULL;
    }

    delete temp;
}


void deleteEnd(Node* &head) {
    if (head == NULL) {
        cout << "List is empty\n";
        return;
    }

    if (head->next == NULL) {
        delete head;
        head = NULL;
        return;
    }

    Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->prev->next = NULL;
    delete temp;
}


void display(Node* head) {
    while (head != NULL) {
        cout << head->data << " ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    Node* head = NULL;

    insertBegin(head, 20);
    insertBegin(head, 10);
    insertEnd(head, 30);
    insertEnd(head, 40);

    cout << "List: ";
    display(head);

    deleteBegin(head);
    cout << "After delete begin: ";
    display(head);

    deleteEnd(head);
    cout << "After delete end: ";
    display(head);

    return 0;
}
