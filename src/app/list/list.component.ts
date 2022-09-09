import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IndexDbService } from '../services/indexdb.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  collections = this.indexDbService.collections;
  list: any[] = [];
  contactForm: FormGroup;
  constructor(private indexDbService: IndexDbService) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      address: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
    // this.indexDbService.demo1();
    // this.indexDbService.insert(this.collections.transactions, 'hello', 'world');
    // const promise = this.indexDbService.get(this.collections.contacts, 'hello');
    // promise.then(x => console.log(x));

    this.refreshList();
  }

  refreshList() {
    this.indexDbService.getAll(this.collections.contacts)
    .then(list => {
      this.list = list;
    });
  }
  onSubmit() {
    // console.log(this.contactForm.value);
    this.indexDbService.insertAutoKey(this.collections.contacts, this.contactForm.value);
    this.refreshList();
    this.contactForm.reset();
  }


  resetDatabase() {
    this.indexDbService.resetDB();
  }

  clearData() {
    this.indexDbService.clearData(this.collections.contacts);
  }

  get name() { return this.contactForm.get('name'); }

  get address() { return this.contactForm.get('address'); }

}
