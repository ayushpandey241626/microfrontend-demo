import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Announcement, ContactAdminComponent } from './contact-admin.component';

describe('ContactAdminComponent', () => {
  let component: ContactAdminComponent;
  let fixture: ComponentFixture<ContactAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component and have a sample announcement', () => {
    expect(component).toBeTruthy();
    expect(component.announcements.length).toBeGreaterThanOrEqual(1);
  });

  it('initial form should be invalid', () => {
    expect(component.announcementForm.valid).toBeFalse();
  });

  it('addAnnouncement should not add when form is invalid', () => {
    const initialCount = component.announcements.length;
    component.addAnnouncement();
    expect(component.announcements.length).toBe(initialCount);
  });

  it('addAnnouncement should add a valid announcement', () => {
    const initialCount = component.announcements.length;
    component.announcementForm.setValue({
      title: 'Test Title',
      message: 'Test message content',
      publishDate: new Date(2025, 5, 10),
    });
    expect(component.announcementForm.valid).toBeTrue();
    component.addAnnouncement();
    expect(component.announcements.length).toBe(initialCount + 1);

    const added = component.announcements[0];
    expect(added.title).toBe('Test Title');
    expect(added.message).toBe('Test message content');
    expect(added.publishDate).toEqual(new Date(2025, 5, 10));
  });

  it('removeAnnouncement should remove the specified announcement', () => {
    // Add a known announcement
    component.announcementForm.setValue({
      title: 'Temp',
      message: 'Temporary',
      publishDate: new Date(2025, 6, 1),
    });
    component.addAnnouncement();
    const addedAnn: Announcement = component.announcements[0];
    const initialCount = component.announcements.length;

    component.removeAnnouncement(addedAnn.id);
    expect(component.announcements.length).toBe(initialCount - 1);
    expect(
      component.announcements.find((a) => a.id === addedAnn.id)
    ).toBeUndefined();
  });
});
